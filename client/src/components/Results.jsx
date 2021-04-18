import React, { Fragment, useEffect, useState, useContext } from 'react'
import { useLocation, useHistory } from "react-router-dom";
import SayCheeseFinder from "../apis/SayCheeseFinder";
import { CheeseContex } from '../context/CheeseContext';
import placeholder from "../Images/Placeholder.png";
import qs from 'qs';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
 
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

const Results = ( {isAuthenticated} , props) => {
    const location = useLocation();
    const params = qs.parse(location.search, {
        ignoreQueryPrefix: true
    })
    const [tag, setTag] = useState(params.Tags)
    const { cheeses, setCheeses } = useContext(CheeseContex);
    const [image, setImage] = useState([])
    const history = useHistory();
    
    useEffect(() => {
        const fetchData = async () => {
            
            var response;
            setTag(params.Tags)
    
            try {
                response = await SayCheeseFinder.post("/api/search", {
                    tag
                })
                setCheeses(response.data.cheese.rows)
                var currImage = []
                for (var i = 0; i < response.data.images.length; i++) {
                    if (response.data.images[i].length > 0){
                        currImage.push("data:image/png;base64," + new Buffer.from(JSON.parse(response.data.images[i][0])).toString("base64"));
                    } else {
                        currImage.push(placeholder)
                    }
                }
                setImage(currImage)
            } catch (err) {
            }
        }
        fetchData();
      }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps
      //if the warning missing dependencies are added the app will simply cause an infinte loop error, app should only rerender upon submit

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (tag !== undefined) {
            history.push({pathname:'/search', search: "Tags=" + tag.replace(/\s/g, ''), state: {results: tag.replace(/\s/g, '')}
        });}
        else{
            history.push({pathname:'/search', search: "Tags=", state: {results: ""}
        });}
    }

    const calculateReviews = (array) => {
        if (array !== "{NULL}") {
            array = array.split(`","`)
            for (var i = 0; i < array.length; i++) {
                array[i] = array[i].split(",")
            }
            var totalScore = 0;
            for (i = 0; i < array.length; i++) {
                totalScore = totalScore + parseInt(array[i][2])
            }
            totalScore = Math.round(totalScore / array.length )
            return String(totalScore)
        } else {
            return "No reviews yet!"
        }
    }

    return (
        <Fragment className="flexboxVertical">
            <form className="searchBar"> 
                <div className="flexboxHorizontal">
                    <i className="fa fa-search icon"/>
                    <input type="text" value={tag} onChange={e => setTag(e.target.value)} className="inputForm" placeholder="tag1; Name1; tag2; ..."/>
                    <button onClick={handleSubmit} className="cheeseButton" type="submit"/>
                </div>
            </form>
            <div className="flexboxHorizontal" style={{justifyContent:"flex-end"}}>
                {isAuthenticated ? <button className="defaultButton" onClick={() => history.push("/Create")}>Add a cheese!</button> : <a className= "cheeseLink" href="/Login">Login to add a cheese!</a> }
            </div>
            <div className="flexboxVertical noTop bottom"> 
            <h1 className="cheeseHeader">Results</h1>
                <div className="scrollbox hideScroll" style={{overflowX:"hidden", width:"100%" }}>
                <table id="cheeses" style={{width:"100%"}}>
                    <tbody style={{width:"100%"}}>
                        <tr>
                            <th className= "hidden" style={{border:"0"}}>Image</th>
                            <th style={{border:"0"}}>Average Review</th>
                            <th style={{border:"0"}}>Price</th>
                            <th style={{border:"0"}}>Name</th>
                            <th style={{border:"0"}}>Tags</th>
                        </tr>                      
                        {cheeses.map((cheese, i) => {
                            return(
                                <tr key = {cheese.cheese_id} onClick={() => history.push({pathname:`/search/${cheese.cheese_id}`})}>
                                    <td style= {{width:"690px", backgroundColor:"transparent"}}><img alt={"User submitted image of: " + cheese.cheese_name} src={image[i]} className="imageResults" /></td>
                                    <td>{/*This is not very elegant but it will have to do, react only lets me do repeat element rendering for arrays...
                                        The calculate reviews determines if a review is present and if present it also calculates the average rounded rating*/
                                        Array(calculateReviews(cheese.review_list)).map(value => {
                                            /*if the value was an int it wouldnt go into the array so reparsing was needed*/
                                            if (value !== "No reviews yet!") {
                                                value = parseInt(value)
                                                /* An array is created containing the average review number that is then used to create the responding amount of stars, the html element is then stored in an array and that array*/
                                                return (<div className="flexboxHorizontal"> {Array.from(Array(value)).map((item, index) => {
                                                    return (<i key={index} className="fa fa-cheese ratingAverage"/>)
                                                })} </div>)
                                            } else { return <p key="0">"No reviews yet!"</p>}
                                        })}</td>
                                    <td><div className="flexboxHorizontal">{(cheese.price > 0) ? "£".repeat(cheese.price) : "?"}</div></td>
                                    <td> <div className="flexboxVertical" style={{maxHeight:"365px", alignItems:"flex-start", textAlign:"left", justifyContent:"flex-start", padding:"25px", overflow:"auto"}}>
                                        <h1 className="noTop">{cheese.cheese_name}</h1>
                                        <ResponsiveEllipsis style={{marginLeft: "15px"}} text={cheese.description ? cheese.description : "No description!"} maxLine='5'/>
                                        <div className="flexboxHorizontal" style={{justifyContent:"center"}}> <h2>Flavour:</h2><div className="slider flexboxHorizontal" ><p>Mild</p><input type="range" min="0" max="5" value={cheese.flavour_slider ? cheese.flavour_slider : 2.5} disabled/><p>Sharp</p></div></div>
                                        <p className="" style={{marginTop:0, marginBottom:0, marginLeft: "15px"}}>{cheese.flavour_umami > 0 ? "Umami ": null} {cheese.flavour_salty > 0  ? "Salty ": null} {cheese.flavour_sweet > 0 ? "Sweet ": null} {cheese.flavour_bitter > 0  ? "Bitter ": null} {cheese.flavour_acidic > 0  ? "Acidic ": null}</p>
                                        <div className="flexboxHorizontal" style={{marginTop:0, marginBottom:0}}><h2 style={{marginLeft: "15px"}}>Smell:</h2><p>{cheese.smell_bitter > 0 ? "Bitter ": null} {cheese.smell_nutty > 0 ? "Nutty ": null} {cheese.smell_grassy > 0 ? "Grassy ": null} {cheese.smell_fruity > 0 ? "Fruity ": null} {cheese.smell_floral > 0 ? "Floral ": null} {cheese.smell_earthy > 0 ? "Earthy ": null}</p></div>
                                    </div></td>
                                    <td>{cheese.tag_name_list.map(tags => { 
                                            if (tags){
                                                return <p key={tags} className="tagDecor">{tags}</p>
                                            }
                                            else{
                                                return null
                                        }})}
                                    </td> 
                                </tr>
                            )
                        })}
                    </tbody>
                </table>  
                </div>
            </div>
        </Fragment>
    )
}

export default Results