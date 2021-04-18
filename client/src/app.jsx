import React, {Fragment, useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Register from './routes/Register';
import Home from './routes/Home';
import Login from './routes/Login';
import Search from './routes/Search';
import Profile from './routes/Profile';
import List from './routes/Lists';
import Maps from './routes/Maps';
import CreateReview from './routes/CreateReview';
import Create from './routes/Create';
import './SayCheese.css';
import SayCheeseFinder from './apis/SayCheeseFinder';


const App = () => {

    //by default user is not authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuth = boolean => {
        setIsAuthenticated(boolean);
    }

    //verifie upon refresh
    const checkAuthenticated = async () => {
        try {
          const res = await SayCheeseFinder.post("/api/is-verified", {
          headers: {jwtToken: window.localStorage.getItem("token")}
        });

          res.data === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        } catch (err) {
          console.error(err.message);
        }
    };

    useEffect(() => {
        checkAuthenticated();
      }, []);


    return (
        <Fragment>
          {/* Router Wrapper */}
          <Router >
              {/* Prevents multiple component rendering */}
              <Switch>
              <Route exact path="/" render={props => <Home {...props} isAuthenticated={isAuthenticated}/>}/>
              <Route exact path="/Login" render={props => !isAuthenticated ? (<Login {...props} setAuth={setAuth}/>) : (<Redirect to="/"/>)}/>
              <Route exact path="/Register" render={props => !isAuthenticated ? (<Register {...props} setAuth={setAuth}/>  ) : (<Redirect to="/"/>)}/>
              <Route exact path="/Search/:cheese_id?/(update)?" render={props => <Search {...props} isAuthenticated={isAuthenticated} />}/>
              <Route exact path="/Maps" render={props => <Maps {...props} isAuthenticated={isAuthenticated}/>}/>
              <Route exact path="/Lists" render={props => !isAuthenticated ? (<Redirect to="/"/>) : <List {...props} isAuthenticated={isAuthenticated}/>}/>
              <Route exact path="/Profile" render={props => !isAuthenticated ? (<Redirect to="/"/>) : <Profile {...props} isAuthenticated={isAuthenticated}/>}/> 
              <Route exact path="/CreateReview/:cheese_id" render={props => !isAuthenticated ? (<Redirect to="/"/>) : <CreateReview {...props} isAuthenticated={isAuthenticated}/>}/>
              <Route exact path="/Create" render={props => !isAuthenticated ? (<Redirect to="/"/>) : <Create {...props} isAuthenticated={isAuthenticated}/>}/> 
              <Route exact path="/Review/:review_id" render={props => !isAuthenticated ? (<Redirect to="/"/>) : <CreateReview {...props} isAuthenticated={isAuthenticated}/>}/> 
              </Switch>
          </Router>
        </Fragment>
    )
}

export default App;