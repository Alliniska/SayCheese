import React, { Fragment, useEffect, useContext} from 'react'
import SayCheeseFinder from "../apis/SayCheeseFinder";
import { AccountContext } from "../context/AccountContext";

export const Profile = () => {
    const {accountData, setAccountData} = useContext(AccountContext);

    useEffect(() => {
        const getAccount = async () => {
            try {
                const response = await SayCheeseFinder.post("/api/account", {
                    headers: {jwtToken: localStorage.token}
                });
                setAccountData(response.data.username)
            } catch (err) {
                console.log(err);
            }
        }
        getAccount()
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    //if the warning missing dependencies are added the app will simply cause an infinte loop error, app should only rerender upon submit

    return (
        <Fragment >
            <div className="navbarSpace">
            Username: {accountData.username} Email: {accountData.email}
            </div>
        </Fragment>
    )
}
