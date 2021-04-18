const jwtGenerator = require("./Utils/jwtGen")
const express = require("express"); //backend handling
const db = require("./db"); //database login
const cors = require("cors"); //same domain policy for server + web app
const bcrypt = require('bcrypt'); //encryption package
const morgan = require("morgan"); //middleware handling
const authorize = require('./middleware/auth');//authorizes tokens
const multer  = require('multer'); //handles multipart data middleware
const AWS = require('aws-sdk'); //amazon bucket handler
const fs = require('fs');
const keys = require('./db/keys.js');
const bodyParser= require('body-parser');
const path = require('path');


//backend handling
const app = express();

//serve static files
if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, './client/build')));
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    })
}

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}))

//Cors
app.use(cors())

//handles import into json
app.use(express.json());

//S3 bucket code taken from https://anikislam.medium.com/setting-up-aws-s3-bucket-and-uploading-and-getting-files-using-express-js-part-2-b418b61c5739
// configuring the DiscStorage engine.
const storage = multer.diskStorage({
    destination : 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

//setting the credentials
AWS.config.update({
    accessKeyId: keys.iam_access_id,
    secretAccessKey: keys.iam_secret,
    region: 'eu-central-1',
});

//Creating a new instance of S3:
const s3= new AWS.S3();

//PICTURE upload and downlaod functions
//The uploadFile function
function uploadFile(source, targetName, res){
    return new Promise((resolve,reject) => {
        console.log('preparing to upload...');
        //preps file
        fs.readFile(source, function (err, filedata) {
        if (!err) {
            const putParams = {
                Bucket      : 'saycheesebucket',
                Key         : targetName,
                Body        : filedata
            };
            //communicates with the amazon S£ service to upload image to bucket
            s3.putObject(putParams, function(err){
            if (err) {
                console.log('Could not upload the file. Error :',err);
                reject(err)
            } 
            else{
                console.log('Successfully uploaded the file');
                resolve()
            }
            });
        }
        else{
            res.status(500).send(`Something went wrong with database communication`)
            reject(err)
        }
        }); 
    })
  }

//The retrieveFile function
function retrieveFile(filename,res){
    return new Promise((resolve,reject) => {
        const getParams = {
            Bucket: 'saycheesebucket',
            Key: filename
          };
          s3.getObject(getParams, function(err, data) {
            if (err){
                res.status(500).send(`Something went wrong with database communication`)
                reject(err)
            }
            else{
                resolve(data.Body)
            }
          });
    })
}

//Routes
//search for all cheeses
app.post("/api/search", async (req, res) => {
    //catch for promise errors
    try {
        //prepare tags for processing
        var tags = ""
        //makes sure request isn't undefined before dealing with it
        if (req.body.tag) {req.body.tag = req.body.tag.replace(/\s/g, '');
        tags = req.body.tag.split(";");}
        var tagsVer = [];
        var tagsName = [];
        var searchResults;
        //see if tags exist in db, if yes get ID and store, if not prepare to search in cheese name
        for(i = 0; i < tags.length; i++){

            const results = await db.query(`SELECT * FROM tag WHERE tag = $1;`, [tags[i]]);
            if (results.rowCount != 0){
                tagsVer.push(results.rows[0].tag_id);
                
            }else if (tags[i] === ''){
                //sometimes and empty array element is created, this cleans it up
                tags[i] = null;
            } else {
                if (tags[i] !== " "){
                tagsName.push(tags[i]);}
            }
        }
        //Search by tag and name
        if (tagsVer.length > 0 && tagsName.length > 0){
            const offset = 1
            const placeholders = tagsVer.map(function(id,i){
                return `$`+(i+offset);
            }).join(`,`);
            const placeholdersName = tagsName.map(function(name,i){
                return '%'+(tagsName[i]+`%`);
            }).join(`|`);
            //LOOK INTO
            searchResults = await db.query(`SELECT c.*, ARRAY_AGG(DISTINCT t.tag) AS tag_name_list, ARRAY_AGG(DISTINCT r.*) AS review_list, ARRAY_AGG (DISTINCT p.picture_data) AS images
                                            FROM cheese c
                                            JOIN tag t ON EXISTS (
                                                SELECT * FROM tag_list ct
                                                WHERE c.cheese_id = ct.cheese_id
                                                AND t.tag_id = ct.tag_id
                                                AND c.cheese_name SIMILAR TO '` + placeholdersName + `' --case insensitive
                                            )
                                            LEFT JOIN review r ON EXISTS(
                                                SELECT * FROM review_list cr
                                                WHERE c.cheese_id = cr.cheese_id
                                                AND r.review_id = cr.review_id
                                            )
                                            LEFT JOIN picture p ON EXISTS(
                                                SELECT * FROM gallery cp
                                                WHERE c.cheese_id = cp.cheese_id
                                                AND cp.picture_id = p.picture_id
                                            )
                                            WHERE EXISTS (
                                                SELECT * FROM tag_list dct
                                                JOIN tag t ON t.tag_id = dct.tag_id
                                                WHERE dct.cheese_id = c.cheese_id
                                                AND (t.tag_id IN (` + placeholders + `))
                                            )
                                            GROUP BY c.cheese_id
                                            HAVING array_agg(t.tag_id) @> array[` + placeholders + `];
                                            `, tagsVer);
        //name search NOTE: This is NOT inclusive for multi name tags and will search for every tag seperately
        } else if (tagsVer.length == 0 && tagsName.length > 0){
            const placeholdersName = tagsName.map(function(name,i){
                return '%'+(tagsName[i]+`%`);
            }).join(`|`);
            searchResults = await db.query(`SELECT c.*, ARRAY_AGG(DISTINCT t.tag) AS tag_name_list, ARRAY_AGG(DISTINCT r.*) AS review_list, ARRAY_AGG (DISTINCT p.picture_data) AS images
                                            FROM cheese c
                                            JOIN tag t ON EXISTS (
                                                SELECT * FROM tag_list ct
                                                WHERE c.cheese_id = ct.cheese_id
                                                AND t.tag_id = ct.tag_id
                                                AND c.cheese_name SIMILAR TO '` + placeholdersName + `' --case insensitive
                                            )
                                            LEFT JOIN review r ON EXISTS(
                                                SELECT * FROM review_list cr
                                                WHERE c.cheese_id = cr.cheese_id
                                                AND r.review_id = cr.review_id
                                            )
                                            LEFT JOIN picture p ON EXISTS(
                                                SELECT * FROM gallery cp
                                                WHERE c.cheese_id = cp.cheese_id
                                                AND cp.picture_id = p.picture_id
                                            )
                                            GROUP BY c.cheese_id`); 
        //tag search
        } else if (tagsVer.length > 0 && tagsName.length == 0){
            const offset = 1
            const placeholders = tagsVer.map(function(id,i){
                return `$`+(i+offset);
            }).join(`,`);
            searchResults = await db.query(`SELECT c.*, ARRAY_AGG(DISTINCT t.tag) AS tag_name_list, ARRAY_AGG(DISTINCT r.*) AS review_list, ARRAY_AGG (DISTINCT p.picture_data) AS images
                                            FROM cheese c
                                            JOIN tag t ON EXISTS (
                                                SELECT * FROM tag_list ct
                                                WHERE c.cheese_id = ct.cheese_id
                                                AND t.tag_id = ct.tag_id
                                            )
                                            LEFT JOIN review r ON EXISTS(
                                                SELECT * FROM review_list cr
                                                WHERE c.cheese_id = cr.cheese_id
                                                AND r.review_id = cr.review_id
                                            )
                                            LEFT JOIN picture p ON EXISTS(
                                                SELECT * FROM gallery cp
                                                WHERE c.cheese_id = cp.cheese_id
                                                AND cp.picture_id = p.picture_id
                                            )
                                            WHERE EXISTS (
                                                SELECT * FROM tag_list dct
                                                JOIN tag t ON t.tag_id = dct.tag_id
                                                WHERE dct.cheese_id = c.cheese_id
                                                AND (t.tag_id IN (` + placeholders + `))
                                            )
                                            GROUP BY c.cheese_id
                                            HAVING array_agg(t.tag_id) @> array[` + placeholders + `];
                                            `, tagsVer);
        //all cheeses   
        } else {
            searchResults = await db.query(`SELECT c.*, ARRAY_AGG(DISTINCT t.tag) AS tag_name_list, ARRAY_AGG(DISTINCT r.*) AS review_list, ARRAY_AGG (DISTINCT p.picture_data) AS images
                                            FROM cheese c
                                            LEFT JOIN tag t ON EXISTS (
                                                SELECT * FROM tag_list ct
                                                WHERE c.cheese_id = ct.cheese_id
                                                AND t.tag_id = ct.tag_id
                                            )
                                            LEFT JOIN review r ON EXISTS(
                                                SELECT * FROM review_list cr
                                                WHERE c.cheese_id = cr.cheese_id
                                                AND cr.review_id = r.review_id
                                            )
                                            LEFT JOIN picture p ON EXISTS(
                                                SELECT * FROM gallery cp
                                                WHERE c.cheese_id = cp.cheese_id
                                                AND cp.picture_id = p.picture_id
                                            )
                                            GROUP BY c.cheese_id`);
        }
        //gets all images from s3 database and saves them in a matrix
        var imagesMatrix = []
        for (var i = 0; i < searchResults.rowCount; i++) {
            if (typeof  searchResults.rows[i].images !== "undefined" && searchResults.rows[i].images[0] !== null ) {
                var imagesArray = []
                for (var j = 0; j < searchResults.rows[i].images.length; j++) {
                    await retrieveFile( searchResults.rows[i].images[j]).then((result) => {
                        imagesArray[j] = JSON.stringify(result).toString("base64")
                    })
                }
                imagesMatrix[i] = imagesArray
            } else {
                imagesMatrix[i] = []
            }
        }
        res.status(200).json({
            status: "sucess",
            cheese: searchResults,
            images: imagesMatrix
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
});

//view cheese
app.post("/api/search/:cheese_id", async (req, res) => {
    try {
        //Query for specific cheese ID
        const results = await db.query(`SELECT c.*, ARRAY_AGG(DISTINCT t.tag) AS tag_name_list, ARRAY_AGG(DISTINCT r.*) AS review_list, ARRAY_AGG (DISTINCT p.picture_data) AS images
                                        FROM cheese c
                                        LEFT JOIN tag t ON EXISTS (
                                            SELECT * FROM tag_list ct
                                            WHERE c.cheese_id = ct.cheese_id
                                            AND t.tag_id = ct.tag_id
                                            AND c.cheese_id = $1
                                        )
                                        LEFT JOIN review r ON EXISTS(
                                            SELECT r.* FROM review_list cr
                                            WHERE c.cheese_id = cr.cheese_id
                                            AND cr.review_id = r.review_id
                                            AND c.cheese_id = $1
                                        )
                                        LEFT JOIN picture p ON EXISTS(
                                            SELECT * FROM gallery cp
                                            WHERE c.cheese_id = cp.cheese_id
                                            AND p.picture_id = cp.picture_id
                                            AND c.cheese_id = $1
                                        )
                                        WHERE c.cheese_id = $1
                                        GROUP BY c.cheese_id;`, [req.params.cheese_id]);
        //tried to make this work in a single query but I had no luck, this is a fix but when possible it should be merged into the main query
        //image handling
        if (results.rows[0].images[0] !== null) {
            var images = []
            for (var i = 0; i < results.rows[0].images.length; i++){
                await retrieveFile(results.rows[0].images[i]).then((result) => {
                        images[i] = JSON.stringify(result)
                    
                })
            }
            res.status(200).json({
                cheese: results,
                images
            });
        }
        else {
            res.status(200).json({
                cheese: results
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
});

//create
app.post("/api/create", upload.array("imageData"), async (req, res) => {
    //converts image data for storage and cheese id for link
    const formData = JSON.parse(req.body.JSONData)
    var cheese_id = null
    try {
        const results = await db.query(`INSERT INTO cheese (cheese_name, description, cheese_storage, flavour_slider, smell_buttery, smell_nutty, smell_grassy, smell_fruity, smell_floral, smell_earthy,
             flavour_umami, flavour_salty, flavour_sweet, flavour_bitter, flavour_acidic, serving_size, calories, total_fat, protein, cholesterol, sodium, total_carbs, price) values ($1, 
                $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
                $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *;`, [formData.name, formData.description , formData.storage, formData.flavour, 
                formData.smellB, formData.smellN, formData.smellG, formData.smellFR, formData.smellFL, formData.smellE, formData.flavourU, formData.flavourSA,
                formData.flavourSW, formData.flavourB, formData.flavourA, formData.serving, formData.calories, formData.totalFat, formData.protein, formData.cholesterol,
                formData.salt, formData.totalCarbs, formData.price]);
        cheese_id = results.rows[0].cheese_id;
        //tag handling
        formData.tags = formData.tags.replace(/\s+/g, '');
        const tags = formData.tags.split(";")
        for (i = 0; i < tags.length; i++) {
            //deletes empty tags in case they occur
            if (tags[i] === ""){
                tags.splice(i, 1)
            }
            if (tags[i]){
                var results2 = await db.query(`SELECT tag FROM tag WHERE tag = $1;`, [tags[i]]);
                //TODO Case insensitivity
                if (results2.rows[0] == null ){
                    const results2 = await db.query(`INSERT INTO tag (tag) VALUES ($1);`, [tags[i]]);
                }
                //creates link between cheese and tag
                results2 = await db.query(`SELECT tag, tag_id FROM tag WHERE tag = $1;`, [tags[i]]);
                const results3 = await db.query(`INSERT INTO tag_list (tag_id, cheese_id) VALUES ($1, $2);`, [results2.rows[0].tag_id, results.rows[0].cheese_id]);
            }
        } 
        //image handling
        const files = req.files
        if (files){
            for (var i = 0; i < files.length; i++){
                await uploadFile(files[i].path, files[i].filename,results.rows[0].cheese_id, res).then(async () => {
                    const results = await db.query(`INSERT INTO picture (picture_data) values ($1) RETURNING *;`, [files[i].filename]);
                    await db.query(`INSERT INTO Gallery (picture_id, cheese_id) values ($1, $2);`, [results.rows[0].picture_id, cheese_id])
                })
                
            }
        }
        res.status(200).json({
            status: "sucess"
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
});

//update
app.put("/api/update/:cheese_id", async (req, res) => {
    try {
        //gets all tags linked to cheese ID for later comparison
        const oldTagsResult = await db.query(`SELECT tag_id FROM tag_list WHERE cheese_id = $1;`, [req.params.cheese_id]);
        const results = await db.query(`UPDATE cheese SET cheese_name = $1, description = $2, cheese_storage = $3, flavour_slider = $4, smell_buttery = $5, smell_nutty = $6,smell_grassy = $7, 
                                                        smell_fruity = $8, smell_floral = $9, smell_earthy = $10, flavour_umami = $11, flavour_salty = $12, flavour_sweet = $13, flavour_bitter = $14,
                                                        flavour_acidic = $15, serving_size = $16, calories = $17, total_fat = $18, protein = $19, cholesterol = $20, sodium = $21,total_carbs = $22, price = $23
                                                        WHERE cheese_id = $24 RETURNING *;`, [req.body.cheese_name, req.body.description , req.body.cheese_storage, req.body.flavour, 
                                                            req.body.smellB, req.body.smellN, req.body.smellG, req.body.smellFR, req.body.smellFL, req.body.smellE, 
                                                            req.body.flavourU, req.body.flavourSA,req.body.flavourSW, req.body.flavourB, req.body.flavourA, req.body.serving, 
                                                            req.body.calories, req.body.totalFat, req.body.protein, req.body.cholesterol,req.body.salt, req.body.totalCarbs, req.body.price, req.params.cheese_id]);
        //tag handling
        var tags = []
        if (req.body.tags.length > 0) {
            req.body.tags = req.body.tags.replace(/\s+/g, '');
            tags = req.body.tags.split(";");
        }
        //if user didnt delete all tags
        if (tags[0]){
            for (i = 0; i < tags.length; i++) {
                //checks empty tag
                if (tags[i] !== "") {
                    var results2 = await db.query(`SELECT tag FROM tag WHERE tag = $1;`, [tags[i]]);
                    //TODO Case insensitivity
                    if (results2.rows[0] == null ){
                        await db.query(`INSERT INTO tag (tag) VALUES ($1);`, [tags[i]]);
                    }
                    //creates link between cheese and tag IF link doesn't exist
                    results2 = await db.query(`SELECT tag, tag_id FROM tag WHERE tag = $1;`, [tags[i]]);
                    const results3 = await db.query(`SELECT tag_id FROM tag_list WHERE tag_id = $1 AND cheese_id = $2;`, [results2.rows[0].tag_id, req.params.cheese_id])
                    if (results3.rows[0] == null){
                        await db.query(`INSERT INTO tag_list (tag_id, cheese_id) VALUES ($1, $2);`, [results2.rows[0].tag_id, req.params.cheese_id]);
                    }
                }
             } 
        }
        //deletes unused tags
        var oldTags = [];
        for (i = 0; i < oldTagsResult.rowCount; i++){
            const result = await db.query(`SELECT tag FROM tag WHERE tag_id = $1;`, [oldTagsResult.rows[i].tag_id]);
            oldTags[i] = result.rows[0].tag;
        }
        //compares OldTags to Tags content 
        var tagsToDelete = [null];
        var len = 0;
        for (i = 0; i < oldTags.length; i++){
            for (j = 0; j < tags.length; j++){
                if (tags[j] == oldTags[i]){
                    j = tags.length;
                }
                if (j == tags.length - 1){
                    tagsToDelete[len] = oldTags[i];
                    len++;
                }
            }
        }
        //Deletes non linked tags and checks if tag is still in use
        if (tagsToDelete[0] != null){
            for (i = 0; i < tagsToDelete.length; i++){
                var tagID = await db.query(`SELECT tag_id FROM tag WHERE tag = $1;`, [tagsToDelete[i]]);
                const result = await db.query(`DELETE FROM tag_list WHERE tag_id = $1 AND cheese_id = $2;`, [tagID.rows[0].tag_id, req.params.cheese_id]);
                var deleteTag = await db.query(`SELECT tag_id FROM tag_list WHERE tag_id = $1 LIMIT 1;`, [tagID.rows[0].tag_id]);
                if (deleteTag.rows[0] == null){
                    const result = await db.query(`DELETE FROM tag WHERE tag_id = $1;`, [tagID.rows[0].tag_id]);
                }
            }
        }
        res.status(200).json({
            status: "sucess",
            data: {
                restaurant: results.rows[0],
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }

});

//delete FOR TESTING OURPOSES ONLY
app.delete("/api/search/:cheese_id/delete", async (req, res) => {
    try {await db.query(`DELETE FROM cheese WHERE cheese_id = $1;`, [req.params.cheese_id]);

        res.status(204).json({
            status: "sucess"
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
});

//create tag TESTING PURPOSES ONLY, creating a tag this way means its not linked to any cheese, use only to setup explore page tags
app.post("/api/createTag", async (req, res) => {
    try {
        await db.query(`INSERT INTO tag (tag) values ($1) RETURNING *;`, [req.body.tag]);
        res.status(200).json({
            status: "sucess"
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
});

//register validation
function validateUser(user, round){

    //username validation not blank
    const validUsername = typeof user.username == 'string' &&
                            user.username.trim() != '' &&
                            /\s/.test(user.username) != 1;
    if (round = 0){
        //email validation not blank
        const validEmail = typeof user.email == 'string' &&
                            user.email.trim() != '' &&
                            /\s/.test(user.email) != 1;
        
        //password validation not blank and right size
        const validPassword = typeof user.password == 'string' &&
        user.password.trim() != '' &&
        user.password.trim().length >= 7 &&
        /\s/.test(user.password) != 1;

        return validEmail && validPassword && validUsername;
    } else{
        //password validation not blank
        const validPassword = typeof user.password == 'string' &&
        user.password.trim() != '' &&
        /\s/.test(user.password) != 1;
        return validPassword && validUsername;
    }
    
}

//Password Hashing
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

//makes sure passwords match
function validPassword(user) {
    if (user.password == user.confirmPassword){
        return true;
    }
    else return false;
}

//register
app.post("/api/register", async (req, res) => {
    if(validateUser(req.body, 1)) {
        if(validPassword(req.body)){
            try {
                const results = await db.query(`SELECT email FROM account WHERE email = $1;`, [req.body.email]);
                //unique email check
                if (results.rows[0] == null){
                    const results2 = await db.query(`SELECT username FROM account WHERE username = $1;`, [req.body.username]);
                    //unique username check
                    if (results2.rows[0] == null){
                        //hash password and store in db
                        var hashedPassword = await hashPassword(req.body.password);
                        const results3 = await db.query(`INSERT INTO account (email, username, user_password) VALUES ($1, $2, $3) RETURNING username;`, [req.body.email, req.body.username, hashedPassword]);
                        //response
                        res.status(200).json({
                            status: "sucess"
                        });
                    }//username not unique
                    else{
                        res.status(401).send(`Username exists`)
                    }
                } //email not unique
                else{
                    res.status(409).send(`Email in use`)
            }
            } catch (err) {
                console.log(err)
                res.status(500).send(`Something went wrong with database communication`)
            }
        } //passwords dont match
        else{
            res.status(400).send(`Passwords don't match`)
        }
    }
    //if invalid input
    else{
        res.status(400).send(`Invalid user credentials`)
    }
});

//login
app.post("/api/login", async (req, res) => {
    if(validateUser(req.body, 0)) {
        try {
            const results = await db.query(`SELECT username, user_password FROM account WHERE username = $1;`, [req.body.username]);
            //unique username check
            if (results.rows[0] != null){
                //hash password and compare
                var hashedPassword = await hashPassword(req.body.password);
                var result = await bcrypt.compare(req.body.password, results.rows[0].user_password);
                //if comparison matches
                if (result){
                    //assign token
                    const token = jwtGenerator(req.body.username);
                        //response
                        res.status(200).json({
                            status: "sucess",
                            token
                        });
                }else{
                    res.status(401).send(`Wrong Password`)
                }
            }//username not unique
            else{
                res.status(401).send(`Username doesn't exist`)
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(`Something went wrong with database communication`)
        }
    }
    //if invalid input
    else{
        res.status(400).send(`Invalid User Credentials`)
    }
});

//fetch account data using jwt
app.post("/api/account", authorize, async (req, res) => {
    try {
        const results = await db.query(`SELECT username, email FROM account WHERE username = $1;`, [req.user]);
        res.status(200).json({
            status: "sucess",
            username: results.rows[0]
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
})

//delete accounts TESTING PURPOSES ONLY
app.delete("/api/deleteAccount", async (req, res) => {
    try {
        await db.query(`TRUNCATE TABLE  account;`);
        res.status(200).json({
            status: "sucess"
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }

});

//Checks jwt token
app.post(("/api/is-verified"), authorize, async (req, res) => {
    res.status(200).json(true);
});

//creates a review
app.post(("/api/createReview"), authorize, async (req, res) => {
    try {
        //get user ID
        const email = await db.query(`SELECT email FROM account WHERE username = $1;`, [req.user]);
        //check if review for cheese exists
        const matching = await db.query(`SELECT r.review_id FROM review_list rl, review r WHERE r.user_id = $1 AND  rl.review_id = r.review_id AND rl.cheese_id = $2;`, [email.rows[0].email, req.body.cheese_id]);
        //if review exists delete
        if (matching.rowCount > 0) {
            await db.query(`DELETE FROM review WHERE review_id = $1;`, [matching.rows[0].review_id]);
            await db.query(`DELETE FROM review_list WHERE review_id = $1;`, [matching.rows[0].review_id]);
        }
        //upload (new)review
        const id = await db.query(`INSERT INTO review (user_id, rating, description) values ($1, $2, $3) RETURNING review_id;`, [email.rows[0].email, req.body.rating, req.body.description]);
        await db.query(`INSERT INTO review_list (review_id, cheese_id) values ($1, $2);`, [id.rows[0].review_id, req.body.cheese_id]);
        res.status(200).json({
            status: "sucess"
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
})

//Select Review From Cheese
app.get(("/api/selectCheeseReview/:cheese_id"), async (req, res) => {
    try {
        const results = await db.query(`SELECT r.* FROM review_list rl, review r WHERE rl.review_id = r.review_id AND rl.cheese_id = $1;`, [req.params.cheese_id]);
        res.status(200).json({
            status: "sucess",
            reviews: results
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
})

//get username
app.post(("/api/getReviewUsername/:email"), async (req, res) => {
    try {
        const results = await db.query(`SELECT a.username FROM account a WHERE a.email = $1;`, [req.params.email]);
        res.status(200).json({
            status: "sucess",
            results: results.rows[0]
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(`Something went wrong with database communication`)
    }
})

//listen to defined port if not set to default
const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`Server is running. Listening to ${port}.`);
});