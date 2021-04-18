import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
//images
import cow from "../Images/cow.jpg";
import sheep from "../Images/sheep.jpg";
import goat from "../Images/goat.jpg";
import cream from "../Images/cream.jpg";
import soft from "../Images/soft.jpg";
import hard from "../Images/hard.jpg";
import sharp from "../Images/sharp.jpg";
import mild from "../Images/mild.jpg";
import cooking from "../Images/cooking.jpg";
import british from "../Images/british.jpg";
import vegan from "../Images/vegan.jpg";
import french from "../Images/french.jpg";
import blue from "../Images/blue.jpg";
import smoked from "../Images/smoked.jpg";
import cottage from "../Images/cottage.jpg";

const Header = () => {

    const [tag, setTag] = useState("");
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault()
        history.push({pathname:'/search', search: "Tags=" + tag.replace(/\s/g, ''), state: {results: tag.replace(/\s/g, '')}
        });
    }

    const handleSubmitPreset = (parameter) => async (e) => {
        e.preventDefault()
        history.push({pathname:'/search', search: "Tags=" + parameter, state: {results: parameter}
        });
    }

    return (
        <div style={{width: "100%"}}>
            <form className="searchBar"> 
            <div className="flexboxHorizontal">
                <i className="fa fa-search icon"/>
                <input type="text" value={tag} onChange={e => setTag(e.target.value)} className="inputForm" placeholder="tag1; Name1; tag2; ..."/>
                <button onClick={handleSubmit} className="cheeseButton" type="submit"/>
                </div>
            </form>
            <div className="flexboxVertical notTop bottom"> 
                <h1 className="cheeseHeader">Explore</h1>
                <div className="scrollbox hideScroll">
                    <div className="flexboxHorizontal" style={{width: "100%"}}>
                        <div className="exploreItem"><img src={cow} onClick={handleSubmitPreset("cow")} alt="" className="exploreImage" style={{objectPosition: "55% 95%"}}/><div className="overlay"><text className="textAlt exploreText"> Cow</text></div></div>
                        <div className="exploreItem"><img src={goat} onClick={handleSubmitPreset("goat")} alt="" className="exploreImage" style={{objectPosition: "45% 50%"}}/><div className="overlay"><text className="textAlt exploreText"> Goat</text></div></div>
                        <div className="exploreItem"><img src={sheep}  onClick={handleSubmitPreset("sheep")} alt="" className="exploreImage" style={{objectPosition: "45% 70%"}}/><div className="overlay"><text className="textAlt exploreText"> Sheep</text></div></div>
                    </div>
                    <div className="flexboxHorizontal" style={{width: "100%"}}>
                        <div className="exploreItem"><img src={hard}  onClick={handleSubmitPreset("hard")} alt="" className="exploreImage" style={{objectPosition: "50% 40%"}}/><div className="overlay"><text className="textAlt exploreText"> Hard</text></div></div>
                        <div className="exploreItem"><img src={soft}  onClick={handleSubmitPreset("soft")} alt="" className="exploreImage" style={{objectPosition: "45% 40%"}}/><div className="overlay"><text className="textAlt exploreText"> Soft</text></div></div>
                        <div className="exploreItem"><img src={cream}  onClick={handleSubmitPreset("cream")} alt="" className="exploreImage" style={{objectPosition: "45% 90%"}}/><div className="overlay"><text className="textAlt exploreText"> Cream</text></div></div>
                    </div>
                    <div className="flexboxHorizontal" style={{width: "100%"}}>
                        <div className="exploreItem"><img src={blue}  onClick={handleSubmitPreset("blue")} alt="" className="exploreImage" style={{objectPosition: "55% 95%"}}/><div className="overlay"><text className="textAlt exploreText"> Blue</text></div></div>
                        <div className="exploreItem"><img src={smoked}  onClick={handleSubmitPreset("smoked")} alt="" className="exploreImage" style={{objectPosition: "45% 50%"}}/><div className="overlay"><text className="textAlt exploreText"> Smoked</text></div></div>
                        <div className="exploreItem"><img src={cottage}  onClick={handleSubmitPreset("cottage")} alt="" className="exploreImage" style={{objectPosition: "45% 60%"}}/><div className="overlay"><text className="textAlt exploreText"> Cottage</text></div></div>
                    </div>
                    <div className="flexboxHorizontal" style={{width: "100%"}}>
                        <div className="exploreItem"><img src={sharp}  onClick={handleSubmitPreset("sharp")} alt="" className="exploreImage" style={{objectPosition: "55% 95%"}}/><div className="overlay"><text className="textAlt exploreText"> Mild</text></div></div>
                        <div className="exploreItem"><img src={mild}  onClick={handleSubmitPreset("mild")} alt="" className="exploreImage" style={{objectPosition: "45% 50%"}}/><div className="overlay"><text className="textAlt exploreText"> Sharp</text></div></div>
                        <div className="exploreItem"><img src={cooking}  onClick={handleSubmitPreset("cooking")} alt="" className="exploreImage" style={{objectPosition: "45% 70%"}}/><div className="overlay"><text className="textAlt exploreText"> Cooking</text></div></div>
                    </div>
                    <div className="flexboxHorizontal" style={{width: "100%"}}>
                        <div className="exploreItem"><img src={vegan}  onClick={handleSubmitPreset("vegan")} alt="" className="exploreImage" style={{objectPosition: "55% 55%"}}/><div className="overlay"><text className="textAlt exploreText"> Vegan</text></div></div>
                        <div className="exploreItem"><img src={french}  onClick={handleSubmitPreset("french")} alt="" className="exploreImage" style={{objectPosition: "45% 80%"}}/><div className="overlay"><text className="textAlt exploreText"> French</text></div></div>
                        <div className="exploreItem"><img src={british}  onClick={handleSubmitPreset("british")} alt="" className="exploreImage" style={{objectPosition: "45% 60%"}}/><div className="overlay"><text className="textAlt exploreText"> British</text></div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
