import React, { Fragment } from 'react'
import Navbar from "../components/Navbar/Navbar";
import { Profile } from '../components/Profile';
import { AccountContextProvider } from '../context/AccountContext';

const profile = ({isAuthenticated}) => {
    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
            <AccountContextProvider>
                < Profile/>
            </AccountContextProvider>
        </Fragment>
    )
}

export default profile;