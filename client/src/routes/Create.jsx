import React, { Fragment } from 'react'
import Navbar from "../components/Navbar/Navbar";
import { CreateCheese } from '../components/CreateCheese';

const Create = ({isAuthenticated}) => {
    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
            < CreateCheese/>
        </Fragment>
    )
}

export default Create;
