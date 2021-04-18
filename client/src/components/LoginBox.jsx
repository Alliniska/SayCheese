import React, {useState} from 'react';
import cheese from "../Images/Cheese.png";
import SayCheeseFinder from "../apis/SayCheeseFinder";
import {useHistory} from 'react-router-dom';

const LoginBox = ({ setAuth }) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await SayCheeseFinder.post("/api/login", {
                username,
                password
            })
            if (response.status === 200){
                window.localStorage.setItem("token", response.data.token);
                setAuth(true);
            }
        } catch (err){
            if(err.response) {
                setError(err.response.data)
            }
        }
    }

    const guestLogin = () => {
        history.push('/');
    }

    return (
        <div className="flexboxVertical loginBox">
            <h1 className="h1Alt hiddenTitle">Say Cheese!</h1>
            <img  className="logoPicture" src={cheese} alt="" />
            <h1 className="h1Alt imageText">Login</h1>
            <p className="error">{error}</p>
            <form className="flexboxVertical"> 
                <input value={username} onChange={e => setUsername(e.target.value)} className="inputForm" placeholder="Username" type="text" required/>
                <input value={password} onChange={e => setPassword(e.target.value)} className="inputForm" type="Password" placeholder="Password" required/>
                <div><button onClick={handleSubmit} className="cheeseButton" type="submit"/></div>
            </form>
            <a  className= "cheeseLink" href="/Register">Not Registered? Sign up!</a>
            <div>
                <button className="defaultButton" onClick={guestLogin}>Guest Visit</button>
            </div>
        </div>
    )
}

export default LoginBox
