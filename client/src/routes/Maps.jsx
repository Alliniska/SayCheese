import React, { Fragment } from 'react'
import Navbar from "../components/Navbar/Navbar";

const maps = ({isAuthenticated}) => {
    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
            <p className="navbarSpace">Feature coming soon!</p>
        </Fragment>
    )
}

export default maps;