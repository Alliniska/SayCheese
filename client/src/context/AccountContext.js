import React, {useState,createContext} from "react";

export const AccountContext = createContext();

export const AccountContextProvider = props => {
    const[accountData, setAccountData] = useState([]);

    return(
        <AccountContext.Provider value ={{ accountData, setAccountData }}>
            {props.children}
        </AccountContext.Provider>
    )
}