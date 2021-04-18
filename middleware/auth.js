const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req,res,next) => {
    try {
        //get token from header
        const jwtToken = req.body.headers.jwtToken;

        //check if token exists
        if (!jwtToken) {
            console.log("oops")
            return res.json("Not Authorized");
        }
        //verify the token
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;
        next()

    } catch (err) {
        console.error(err.message);
        return res.json("Not Authorized");
    }
};