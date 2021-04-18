import React, { useState, createContext} from "react";

export const CheeseContex = createContext();

export const CheeseContexProvider = props => {
    const[cheeses, setCheeses] = useState([]);

    return(
        <CheeseContex.Provider value ={{ cheeses, setCheeses }}>
            {props.children}
        </CheeseContex.Provider>
    )
}