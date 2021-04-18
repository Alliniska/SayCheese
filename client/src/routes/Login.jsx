import React, { Fragment } from 'react';
import LoginBox from "../components/LoginBox";

const login = ({ setAuth }) => {
    return (
        <Fragment>
            <div className="cheeseBackground">
                <LoginBox setAuth={setAuth}/>
            </div>
        </Fragment>
    )
}

export default login
