import React, { Fragment } from 'react'
import Navbar from "../components/Navbar/Navbar";

const lists = ({isAuthenticated}) => {
    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
        </Fragment>
    )
}

export default lists;