import React, { Fragment } from 'react'
import Navbar from "../components/Navbar/Navbar";
import { CreateReview } from '../components/CreateReview';

const createReview = ({isAuthenticated}) => {
    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
            < CreateReview/>
        </Fragment>
    )
}

export default createReview;
