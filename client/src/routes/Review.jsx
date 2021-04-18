import React, { Fragment } from 'react'
import Navbar from "../components/Navbar/Navbar";
import { ReviewView } from '../components/ReviewView';

const Review = ({isAuthenticated}) => {
    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
            < ReviewView/>
        </Fragment>
    )
}

export default Review;
