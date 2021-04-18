import React, { Fragment, useState} from 'react'
import { useHistory, useLocation } from "react-router-dom";
import SayCheeseFinder from "../apis/SayCheeseFinder";
import StarRating from "./Rating/StarRating"

export const CreateReview = (props) => {
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(null);
    const history = useHistory();
    const location = useLocation();
    const cheese_id = location.pathname.split("/:")[1];

    const handleSubmit = async () => {
        try {
            await SayCheeseFinder.post("/api/createReview" , {
                headers: {jwtToken: localStorage.token},
                rating,
                description, 
                cheese_id
            });
            history.go(-1)
        } catch (err) {
                console.error(err.message);
        }
    }

    return (
        <Fragment>
            <button className="navbarSpace defaultButtonAlt" onClick={() => history.go(-1)}>BACK</button>
            <form className="navbarSpace flexboxVertical">
                <StarRating  {...props} rating={rating} setRating={setRating}/>
                <div>
                    <textarea maxLength="500" value={description} onChange={e => setDescription(e.target.value)}  rows="4" cols="50" className="inputFormLarge" placeholder="Write your review!" required/>
                    <button style={{marginTop:"0px", paddingTop:"35px"}}onClick={handleSubmit} className="cheeseButton" type="button"/>
                </div>
            </form>
        </Fragment>
    )
}
