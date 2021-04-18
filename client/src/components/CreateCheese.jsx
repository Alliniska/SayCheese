import React, { Fragment, useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import SayCheeseFinder from "../apis/SayCheeseFinder";
import PriceRating from './Rating/PriceRating';

export const CreateCheese = (props) => {
    const history = useHistory();
    //general
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [storage, setStorage] = useState("")
    const [price, setPrice] = useState(0)
    const [pictures, setPictures] = useState([])
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
    const [serving, setServing] = useState(100)
    const [calories, setCalories] = useState(0)
    const [totalFat, setTotalFat] = useState(0)
    const [protein, setProtein] = useState(0)
    const [cholesterol, setCholesterol] = useState(0)
    const [salt, setSalt] = useState(0)
    const [totalCarbs, setTotalCarbs] = useState(0)
    //tags
    const [tags, setTags] = useState("")

    const handleUpload = async (e) => {
        setPictures([])
        var filesToAdd = []
        for (var i = 0; i < e.target.files.length; i++) {
            filesToAdd.push( e.target.files[i])
        }
        setPictures(filesToAdd)
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            let jsonData = {name,
                description,
                storage,
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
                tags}
            let formData = new FormData()
            formData.append("JSONData", JSON.stringify(jsonData) )
            for (var i = 0; i < pictures.length; i++){
                formData.append("imageData", pictures[i] )
            }
            await SayCheeseFinder.post("/api/Create", formData
            )
        } catch (err){
            if(err.response) { 
                console.log(err);
            }
        }
        history.go(-1)
    }
    useEffect(() => {
    }, [setPictures]);

    return (
        <Fragment>
            <button className="navbarSpace defaultButtonAlt" onClick={() => history.go(-1)}>BACK</button>
            <div className="flexboxVertical bottom"> 
            <h1 className="cheeseHeader"> New Cheese</h1>
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
                                        <p>Cheese image upload: </p><input onChange={handleUpload} type="file" multiple accept="image/*"/>
                                    </div>
                                    <div className="flexboxHorizontalS">
                                        <p>Storage: </p><input maxLength="128" placeholder="Cheese storage type" type="text" value={storage} onChange={e => setStorage(e.target.value)} className="inputForm"/>
                                    </div>
                                    <div>
                                        <PriceRating  {...props} price={price} setPrice={setPrice}/>
                                    </div>
                                </div>
                                <div className="flexboxVertical" id="Nutritional info">
                                    <h3>Nutritional Values:</h3>
                                    <div className="flexboxHorizontalS"><p>Serving size: </p><input type="number" value={serving} onChange={e => (typeof value === "undefined") ? setServing(e.target.value) : setServing(0)} className="inputForm"/><p>g</p></div>
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
                                            <p>Mild</p><input type="range" min="0" max="5" value={flavour} onChange={e => (typeof value === "undefined") ? setFlavour(e.target.value) : setFlavour(0)}/><p>Sharp</p>
                                        </div>
                                        <div className="flexboxHorizontalS"><p>Umami: </p> <input type="checkbox" value={flavourU} onChange={e => e.target.checked ? setFlavourU(1): setFlavourU(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Salty: </p> <input type="checkbox" value={flavourSA} onChange={e => e.target.checked ? setFlavourSA(1): setFlavourSA(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Sweet: </p> <input type="checkbox" value={flavourSW} onChange={e => e.target.checked ? setFlavourSW(1): setFlavourSW(0)}/></div>                              
                                        <div className="flexboxHorizontalS"><p>Bitter: </p> <input type="checkbox" value={flavourB} onChange={e => e.target.checked ? setFlavourB(1): setFlavourB(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Acidic: </p> <input type="checkbox" value={flavourA} onChange={e => e.target.checked ? setFlavourA(1): setFlavourA(0)}/></div>
                                    </div>
                                    <div id="Smell info">
                                        <h3>Smell:</h3>
                                        <div className="flexboxHorizontalS"><p>Buttery: </p> <input type="checkbox" value={smellB} onChange={e => e.target.checked ? setSmellB(1): setSmellB(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Nutty: </p> <input type="checkbox" value={smellN} onChange={e => e.target.checked ? setSmellN(1): setSmellN(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Grassy: </p> <input type="checkbox" value={smellG} onChange={e => e.target.checked ? setSmellG(1): setSmellG(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Fruity: </p> <input type="checkbox" value={smellFR} onChange={e => e.target.checked ? setSmellFR(1): setSmellFR(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Floral: </p> <input type="checkbox" value={smellFL} onChange={e => e.target.checked ? setSmellFL(1): setSmellFL(0)}/></div>
                                        <div className="flexboxHorizontalS"><p>Earthy: </p> <input type="checkbox" value={smellE} onChange={e => e.target.checked ? setSmellE(1): setSmellE(0)}/></div>
                                    </div>
                                    
                                    <div id="Other info">
                                        <input  type="text" value={tags} onChange={e => (typeof value === "undefined") ? setTags(e.target.value) : setTags("")} className="inputFormLarge" placeholder="Tag1; Tag2; Tag3; ..."/>
                                    </div> 
                                    <button onClick={handleSubmit} className="cheeseButton" type="submit" style={{margin:"10px"}}/>
                                </div>
                            </div>
                        </div> 
                    </form>
                </div>
            </div>
        </Fragment>
    )
}
