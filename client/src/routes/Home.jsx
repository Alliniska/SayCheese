import React, { Fragment } from 'react';
import Header from "../components/Header";
import Navbar from "../components/Navbar/Navbar";

const home = ({ isAuthenticated }) => {
    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
            <Header/>
        </Fragment>
    )
}

export default home
