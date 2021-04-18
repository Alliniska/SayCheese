import React, { useState, createContext} from "react";

export const ViewContext = createContext();

export const ViewContexProvider = props => {
    const[data, setData] = useState([]);

    return(
        <ViewContext.Provider value ={{ data, setData }}>
            {props.children}
        </ViewContext.Provider>
    )
}