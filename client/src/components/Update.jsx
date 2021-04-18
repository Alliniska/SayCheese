import React, { Fragment, useState, useEffect } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import SayCheeseFinder from "../apis/SayCheeseFinder";
import PriceRating from './Rating/PriceRating';

const Update = (props) => {
    const history = useHistory();
    const location = useLocation();
    const cheese_id = location.pathname.split("/")[2];
    //general
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [storage, setStorage] = useState("")
    const [price, setPrice] = useState(0)
    //taste
    const [flavour, setFlavour] = useState(0)
    const [smellB, setSmellB] = useState(0)
    const [smellN, setSmellN] = useState(0)
    const [smellG, setSmellG] = useState(0)
    const [smellFR, setSmellFR] = useState(0)
    const [smellFL, setSmellFL] = useState(0)
    const [smellE, setSmellE] = useState(0)
    const [flavourU, setFlavourU] = useState(0)
    const [flavourSA, setFlavourSA] = useState(0)
    const [flavourSW, setFlavourSW] = useState(0)
    const [flavourB, setFlavourB] = useState(0)
    const [flavourA, setFlavourA] = useState(0)
    //nutritional
    const [serving, setServing] = useState(0)
    const [calories, setCalories] = useState(0)
    const [totalFat, setTotalFat] = useState(0)
    const [protein, setProtein] = useState(0)
    const [cholesterol, setCholesterol] = useState(0)
    const [salt, setSalt] = useState(0)
    const [totalCarbs, setTotalCarbs] = useState(0)
    //tags
    const [tags, setTags] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await SayCheeseFinder.put("/api/Update/" + cheese_id, {
                cheese_name: name,
                description,
                cheese_storage: storage,
                price,
                flavour,
                smellB,
                smellN,
                smellG,
                smellFR,
                smellFL,
                smellE,
                flavourU,
                flavourSA,
                flavourSW,
                flavourB,
                flavourA,
                serving,
                calories,
                totalFat,
                protein,
                cholesterol,
                salt,
                totalCarbs,
                tags
            })
        } catch (err){
            if(err.response) { 
                console.log(err);
            }
        }
        history.go(-1)
    }

    useEffect(() => {
        const fetchData = async () => {
            var response;

            try {
                response = await SayCheeseFinder.post("/api/search/" + cheese_id);
                setName(response.data.cheese.rows[0].cheese_name)
                if (response.data.cheese.rows[0].description) {
                    setDescription(response.data.cheese.rows[0].description)
                }
                if (response.data.cheese.rows[0].cheese_storage) {
                    setStorage(response.data.cheese.rows[0].cheese_storage)
                }
                setPrice(response.data.cheese.rows[0].price)
                setFlavour(response.data.cheese.rows[0].flavour_slider)
                setSmellB(response.data.cheese.rows[0].smell_buttery)
                setSmellN(response.data.cheese.rows[0].smell_nutty)
                setSmellG(response.data.cheese.rows[0].smell_grassy)
                setSmellFR(response.data.cheese.rows[0].smell_fruity)
                setSmellFL(response.data.cheese.rows[0].smell_floral)
                setSmellE(response.data.cheese.rows[0].smell_earthy)
                setFlavourU(response.data.cheese.rows[0].flavour_umami)
                setFlavourSA(response.data.cheese.rows[0].flavour_salty)
                setFlavourSW(response.data.cheese.rows[0].flavour_sweet)
                setFlavourB(response.data.cheese.rows[0].flavour_bitter)
                setFlavourA(response.data.cheese.rows[0].flavour_acidic)
                setServing(response.data.cheese.rows[0].serving_size)
                setCalories(response.data.cheese.rows[0].calories)
                setTotalFat(response.data.cheese.rows[0].total_fat)
                setProtein(response.data.cheese.rows[0].protein)
                setCholesterol(response.data.cheese.rows[0].cholesterol)
                setSalt(response.data.cheese.rows[0].sodium)
                setTotalCarbs(response.data.cheese.rows[0].total_carbs)

                //null tag spawns here careful
                if (response.data.cheese.rows[0].tag_name_list) {
                    if (response.data.cheese.rows[0].tag_name_list[0]) {
                        var tags = "";
                        for (var i = 0; i < response.data.cheese.rows[0].tag_name_list.length; i++) {
                            tags = tags.concat( response.data.cheese.rows[0].tag_name_list[i]+ "; ")
                        }
                        setTags(tags)
                    }
                }
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchData();
    // eslint-disable-next-line
    }, []); 
      //array is empty because the fields need to be initialised according to the database data not upon reset

      //add image data stuff will need backend
    return (
        <Fragment>
            <button className="navbarSpace defaultButtonAlt" onClick={() => history.go(-1)}>BACK</button>
            <div className="flexboxVertical bottom"> 
            <h1 className="cheeseHeader"> Update Cheese</h1>
                <div className="scrollbox hideScroll" style={{overflowX:"hidden"}}>
                    <form>
                        <div name="formBox" className="flexboxHorizontal" style={{alignItems:"flex-start"}}>
                            <div className="flexboxVertical" style={{alignItems:"flex-start", margin:"25px 25px"}}>
                                <div className="flexboxVertical" id="General info">
                                    <div className="flexboxHorizontalS" style={{alignItems:"flex-start"}}>
                                        <input maxLength="64" placeholder="Cheese name" type="text" value={name} onChange={e => setName(e.target.value)} className="inputFormLarge" required="required"/><p className="error">*</p>
                                    </div>
                                    <div className="flexboxHorizontalS" style={{alignItems:"flex-start"}}>
                                        <textarea placeholder="Description" maxLength="500" value={description} onChange={e => (typeof value === "undefined") ? setDescription(e.target.value) : setDescription("")} rows="4" cols="50" className="inputFormLarge" required="required"/><p className="error">*</p>
                                    </div>
                                    <div className="flexboxHorizontalS">
                                        <p>Image updating coming soon!</p>
                                    </div>
                                    <div className="flexboxHorizontalS">
                                        <p>Storage: </p><input maxLength="128" placeholder="Cheese storage type" type="text" value={storage} onChange={e => setStorage(e.target.value)} className="inputForm"/>
                                    </div>
                                    <div>
                                        <PriceRating  {...props} price={price} setPrice={setPrice}/>
                                    </div>
                                </div>
                                <div className="flexboxVertical" id="Nutritional info" >
                                    <h3>Nutritional Values:</h3>
                                    <div className="flexboxHorizontalS"><p>Serving: </p><input type="number" value={serving} onChange={e => (typeof value === "undefined") ? setServing(e.target.value) : setServing(0)} className="inputForm"/><p>kcal</p></div>                  
                                    <div className="flexboxHorizontalS"><p>Calories: </p><input type="number" value={calories} onChange={e => (typeof value === "undefined") ? setCalories(e.target.value) : setCalories(0)} className="inputForm"/><p>kcal</p></div>
                                    <div className="flexboxHorizontalS"><p>Total fat: </p><input type="number" value={totalFat} onChange={e => (typeof value === "undefined") ? setTotalFat(e.target.value) : setTotalFat(0)} className="inputForm"/><p>g</p></div>
                                    <div className="flexboxHorizontalS"><p>Total carbohydrates: </p><input type="number" value={totalCarbs} onChange={e => (typeof value === "undefined") ? setTotalCarbs(e.target.value) : setTotalCarbs(0)} className="inputForm"/><p>g</p></div>
                                    <div className="flexboxHorizontalS"><p>Protein: </p><input type="number" value={protein} onChange={e => (typeof value === "undefined") ? setProtein(e.target.value) : setProtein(0)} className="inputForm"/><p>g</p></div>
                                    <div className="flexboxHorizontalS"><p>Salt: </p><input type="number" value={salt} onChange={e => (typeof value === "undefined") ? setSalt(e.target.value) : setSalt(0)} className="inputForm"/><p>g</p></div>
                                    <div className="flexboxHorizontalS"><p>Cholesterol: </p><input type="number" value={cholesterol} onChange={e => (typeof value === "undefined") ? setCholesterol(e.target.value) : setCholesterol(0)} className="inputForm"/><p>mg</p></div>
                                </div>
                            </div>
                            <div className="flexboxVertical" style={{alignItems:"flex-start", marginLeft:"20px", marginRight:"20px"}}>
                                <div id="Taste info">
                                <h2>Tasting Info: </h2>
                                    <div id="Flavour info">
                                        <h3>Flavour:</h3>
                                        <div className="flexboxHorizontalS" >                                    
                                            <p>Mild</p> <input type="range" min="0" max="5" value={flavour} onChange={e => (typeof value === "undefined") ? setFlavour(e.target.value) : setFlavour(0)}/><p>Sharp</p>
                                        </div>
                                        <div className="flexboxHorizontalS"><p>Umami: </p> {flavourU === "0" || flavourU === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setFlavourU(1): setFlavourU(0)}/> : <input type="checkbox" defaultChecked  onClick={e => e.target.checked ? setFlavourU(1): setFlavourU(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Salty: </p> {flavourSA === "0" || flavourSA === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setFlavourSA(1): setFlavourSA(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setFlavourSA(1): setFlavourSA(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Sweet: </p> {flavourSW === "0" || flavourSW === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setFlavourSW(1): setFlavourSW(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setFlavourSW(1): setFlavourSW(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Bitter: </p> {flavourB === "0" || flavourB === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setFlavourB(1): setFlavourB(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setFlavourB(1): setFlavourB(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Acidic: </p> {flavourA === "0" || flavourA === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setFlavourA(1): setFlavourA(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setFlavourA(1): setFlavourA(0)}/>}</div>
                                    </div>
                                    <div id="Smell info">
                                        <h3>Smell:</h3>
                                        <div className="flexboxHorizontalS"><p>Buttery: </p> {smellB === "0" || smellB === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setSmellB(1): setSmellB(0)}/> : <input type="checkbox" defaultChecked  onClick={e => e.target.checked ? setSmellB(1): setSmellB(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Nutty: </p> {smellN === "0" || smellN === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setSmellN(1): setSmellN(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setSmellN(1): setSmellN(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Grassy: </p> {smellG === "0" || smellG === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setSmellG(1): setSmellG(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setSmellG(1): setSmellG(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Fruity: </p> {smellFR === "0" || smellFR === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setSmellFR(1): setSmellFR(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setSmellFR(1): setSmellFR(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Floral: </p> {smellFL === "0" || smellFL === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setSmellFL(1): setSmellFL(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setSmellFL(1): setSmellFL(0)}/>}</div>
                                        <div className="flexboxHorizontalS"><p>Earthy: </p> {smellE === "0" || smellE === 0 ? <input type="checkbox"  onClick={e => e.target.checked ? setSmellE(1): setSmellE(0)}/> : <input type="checkbox" defaultChecked onClick={e => e.target.checked ? setSmellE(1): setSmellE(0)}/>}</div>
                                    </div>
                                </div>
                                <div id="Other info">
                                    <input  type="text" value={tags} onChange={e => (typeof value === "undefined") ? setTags(e.target.value) : setTags("")} className="inputFormLarge" placeholder="Tag1; Tag2; Tag3; ..."/>
                                </div> 
                                <button onClick={handleSubmit} className="cheeseButton" type="submit" style={{margin:"10px"}}/>
                            </div>    
                        </div> 
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Update