import React from 'react';
import {useHistory, NavLink, Link} from 'react-router-dom';
import icon from '../../Images/cheeseIcon.png';

const Navbar = ({ isAuthenticated }) => {
    
    const history = useHistory();

    const loginRedirect = () => {
        history.push('/Login');
    }

    return (
        <nav className="navbarBar" >
            <Link to="/" className="flexboxHorizontal" style={{ textDecoration: 'none', height: "72px"}}>
                <img className="logo" src={icon} alt="Cheese logo"></img>
                <h1 className= "logoText" style={{paddingLeft: "1rem"}}>Say Cheese!</h1>
            </Link>
            <div className="spacer"/>
            <div className="navbarList">
                <ul className="flexboxHorizontal" style={{marginRight: "1rem"}}>
                    <li><NavLink exact activeClassName="navbarIconActive" to="/" className="fa fa-search navbarIcon" alt="Search"/></li>
                    <li><NavLink exact activeClassName="navbarIconActive" to="/Maps" className="fa fa-map-marker-alt navbarIcon" alt="Maps"/></li>
                    {/*isAuthenticated ?<li><NavLink exact activeClassName="navbarIconActive" to="/Lists" className="fa fa-book navbarIcon" alt="Lists"/></li> : null*/}
                    {isAuthenticated ? <li><NavLink exact activeClassName="navbarIconActive" to="/Profile" className="fa fa-user navbarIcon" alt="Profile"/></li> :
                    <li><button onClick={loginRedirect} id="login" className="defaultButtonAlt" >Login</button></li>}
                    {/*isAuthenticated ? <li><NavLink exact activeClassName="navbarIconActive" to="/Logout" className="fa fa-power-off navbarIcon" alt="Logout"/></li> : null*/}
                </ul>
            </div>
        </nav>
    )
};

export default Navbar;
