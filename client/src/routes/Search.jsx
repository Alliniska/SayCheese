import React, {Fragment} from 'react';
import Navbar from "../components/Navbar/Navbar";
import Results from '../components/Results';
import View from '../components/View';
import Update from '../components/Update';
import { useLocation} from "react-router-dom";
import { CheeseContexProvider } from '../context/CheeseContext';
import { ViewContexProvider } from '../context/ViewContext';

const Search = ({ isAuthenticated }) => {
    const location = useLocation()

    function pageViewer(props) {
        //if the optional param is there for cheese ID then load view
        const pathSplit = location.pathname.split("/")
        if (typeof pathSplit[2] !== "undefined" && pathSplit[2] !== ""){
            if (typeof pathSplit[3] !== "undefined" && pathSplit[3] !== "") {
                return <Update/>
            }
            else{
                return <ViewContexProvider><View isAuthenticated={isAuthenticated}/></ViewContexProvider>
            }
        }else{
            return <CheeseContexProvider><Results isAuthenticated={isAuthenticated}/></CheeseContexProvider>
        }
    }
    

    return (
        <Fragment>
            <Navbar isAuthenticated={isAuthenticated}/>
            {pageViewer()}
        </Fragment>
)};

export default Search
