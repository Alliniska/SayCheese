import React, { Fragment, useEffect, useContext, useState } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import SayCheeseFinder from "../apis/SayCheeseFinder";
import { ViewContext } from "../context/ViewContext";
import placeholder from "../Images/Placeholder.png";


const View = ({isAuthenticated}) => {
    const history = useHistory();
    const location = useLocation();
    const cheese_id = location.pathname.split("/")[2];
    //context isnt technically needed for mapping these as they only give 1 result. Context however does solve the undefinied object init
    const { data, setData } = useContext(ViewContext);
    const [image, setImage] = useState([""]);
    //quick fix solution for usernames, should be merged with all reviews
    const [reviews, setReviews] = useState([""]);
    const [reviewUser, setReviewUsers] = useState([""]);
    const [current, setCurrent] = useState(0);
    const [currentR, setCurrentR] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            var response;
            try {
                response = await SayCheeseFinder.post("/api/search/" + cheese_id);
                setData(response.data.cheese.rows)
                var currImage = []
                if(typeof response.data.images !== "undefined"){
                    for (var i = 0; i < response.data.images.length; i++) {
                        if (response.data.images[i].length > 0) {
                            currImage.push("data:image/png;base64," + new Buffer.from(JSON.parse(response.data.images[i])).toString("base64"));
                        } else {
                            currImage.push(placeholder)
                        }
                    }
                } else {
                    currImage.push(placeholder)
                }
                setImage(currImage)
                //sets the data in needed format for reviews
                if(typeof response.data.cheese.rows[0].review_list !== "undefined" &&  response.data.cheese.rows[0].review_list.includes("NULL") !== true){
                    const reviewsList = response.data.cheese.rows[0].review_list.replace(/}|{|"|\(|\)/g ,"").match(/(\\.*?\\|[^",\s]+)(?=\s*,|\s*$)/g)
                    for (i = 3; i < reviewsList.length; i = i +4){
                        reviewsList[i] = reviewsList[i].replace(/\\/g,"")
                    }
                    setReviews(reviewsList)
                    var currUser = []
                    //fetch username
                    for (i = 1; i < reviewsList.length; i = i + 4) {
                        currUser.push((await SayCheeseFinder.post("/api/getReviewUsername/" + reviewsList[i])).data.results.username)
                    }
                    setReviewUsers(currUser)
                }
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchData();
      }, [cheese_id, setData, setImage]); 

    const isDefined = (variable) => {
        if (typeof variable === "undefined"){
            return false
        } else {
            return true
        }
    }

    const reviewRedirect = () => {
        history.push({pathname:'/CreateReview/:' + cheese_id})
    }

    const nextSlide = () => {
        setCurrent(current === image.length - 1 ? 0 : current + 1)
    }

    const prevSlide = () => {
        setCurrent(current === 0 ? image.length - 1 : current - 1)
    }

    const prevReview = () => {
        setCurrentR(currentR === (reviews.length / 4 - 1) ? 0 : currentR + 1)
    }

    const nextReview = () => {
        setCurrentR(currentR === 0 ? reviews.length / 4 - 1 : currentR - 1)
    }

    const createReviews = () => {
        var renderContent = [];
        if (reviews){
            for (var i = 0; i < reviews.length /4; i++){
                var j = i*4
                //active slide items needed and slide gallery
                renderContent.push(<div key={j} style={{height:"100%"}} className={i === currentR ? "slideActive scrollbox" : "slide"}>{i === currentR && (<div ><p >Posted by user: {reviewUser[i]}</p><p key={j+2}>Rating:</p> {(reviews[j+2] > 0) ? <div className="flexboxHorizontal">{createIcons(reviews[j+2])}</div> : "?"}<p key={j+3}>{reviews[j+3]}</p></div>)} </div>)
            }
        }
        return renderContent
    }

    const createIcons = (n) => {
        var renderIcons = []
        for (var i = 0; i < n; i++) {
            renderIcons.push(<div key={i} className="fa fa-cheese" style={{color:"#E79D08", margin:"5px", fontSize:"20px"}}></div>)
        }
        return renderIcons
    }

    return (
        <Fragment>
            <div className="flexboxHorizontal navbarSpace">
                <button  className="defaultButtonAlt" onClick={() => history.go(-1)}>BACK</button>
                <div className="spacer"/>
                {isAuthenticated ? <button  className="defaultButtonAlt"  onClick={() => history.push("/search/" + cheese_id + "/update")}>Update this Cheese</button> : <a className= "cheeseLink" href="/Login">Login to update or review this cheese</a>}
                {isAuthenticated ? <button onClick={reviewRedirect} className= "defaultButtonAlt">Review Me!</button> : "" }
            </div>
           <div>
               <h1 className="cheeseHeader" style={{textAlign: "center"}}> {isDefined(data[0]) ?  data[0].cheese_name : "Cheese Name"}</h1>
                {/**Content logic */}
                <div className="scrollbox hideScroll" style={{overflow:"auto", height: "79vh"}}>
                    {isDefined(data[0]) ? <div id="view"><div className="flexboxHorizontal" style={{alignItems:"flex-start", justifyContent:"flex-start"}}>
                        <div className="flexboxVertical" style={{width:"100%", flex:"1"}}> 
                            {/**Image gallery */}
                            <div className="gallery">
                                {image.map((picture, i) => {
                                    /**Display only current image slide in gallery*/
                                    return (<div key={i} className={i === current ? "slideActive" : "slide"}>{i === current && (<img className="sliderImage" alt={"User submitted image of: " + data[0].cheese_name} src={picture}/>)}</div>)
                                })}
                                {image.length > 1 ? <div><button className="prev" onClick={prevSlide}/><button className="next" onClick={nextSlide}/></div> : null}
                            </div>
                            {/**Review logic */}
                            <div style={{position: "relative", height: "280px", width: "480px", maxHeight: "280px", maxWidth: "480px"}}>
                                {reviews.length > 4 ? <div><button style={{left:"-5px", top:"55%"}} className="prev" onClick={prevReview}/><button style={{right:"-5px", top:"55%"}} className="next" onClick={nextReview}/></div> : null}
                                <h2>Reviews:</h2><div className="galleryR" style={{margin:"auto"}}>{reviews.length > 1 ? createReviews() : <p>No reviews!</p>}</div>
                            </div>
                        </div>
                        {/**Other data column */}
                        <div className="flexboxVertical" style={{width:"100%", flex:"1"}} >
                            <p> {data[0].description}</p>
                            <h2>Tastes: </h2>
                            <div className="flexboxHorizontalS" ><h3>Flavour:</h3><p>Mild</p><input type="range" min="0" max="5" value={data[0].flavour_slider ? data[0].flavour_slider : 2.5} disabled/><p>Sharp</p></div>
                            <p style={{marginTop:0, marginBottom:0, marginLeft: "15px"}}>{data[0].flavour_umami > 0 ? "Umami ": null} {data[0].flavour_salty > 0  ? "Salty ": null} {data[0].flavour_sweet > 0 ? "Sweet ": null} {data[0].flavour_bitter > 0  ? "Bitter ": null} {data[0].flavour_acidic > 0  ? "Acidic ": null}</p>
                            <div className="flexboxHorizontalS" ><h3 style={{marginLeft: "15px"}}>Smell:</h3><p>{data[0].smell_bitter > 0 ? "Bitter ": null} {data[0].smell_nutty > 0 ? "Nutty ": null} {data[0].smell_grassy > 0 ? "Grassy ": null} {data[0].smell_fruity > 0 ? "Fruity ": null} {data[0].smell_floral > 0 ? "Floral ": null} {data[0].smell_earthy > 0 ? "Earthy ": null}</p></div>
                            <div className="flexboxHorizontalS"><h2> Cheese Nutritional Information</h2> <p>*%Recommended daily value</p></div>
                            <div style={{display:"flex"}}><p>Serving: {data[0].serving_size ? data[0].serving_size : 0}g </p><p>Cal: {data[0].calories ? data[0].calories : 0}kcal</p><p> Total Fat: {data[0].total_fat ? data[0].total_fat : 0}g </p><p>Protein: {data[0].protein ? data[0].protein : 0}g </p><p> cholesterol: {data[0].cholesterol ? data[0].cholesterol : 0}g</p><p> Salt: {data[0].sodium ? data[0].sodium : 0}g </p><p>Total Carbs: {data[0].total_carbs ? data[0].total_carbs : 0}g</p></div>
                            <p>Price: {(data[0].price > 0) ? "£".repeat(data[0].price) : "?"}</p>

                            {/**Tag logic */}
                            <div className="flexboxHorizontal"><h2>Tags: </h2>{data[0].tag_name_list.map((tags, index) => {
                                if (tags){
                                    return <p key={index} className="tagDecor">{tags}</p>
                                }
                                else {
                                    return null
                                }
                            })}
                            </div>
                        </div>
                    </div></div>: null}
                </div>
            </div>
        </Fragment>
    )
}

export default View
