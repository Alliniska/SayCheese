import React, {useState} from 'react';
import cheese from "../Images/Cheese.png";
import SayCheeseFinder from "../apis/SayCheeseFinder";
import {useHistory} from 'react-router-dom';

const RegisterBox = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("");
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await SayCheeseFinder.post("/api/register", {
                email,
                username,
                password,
                confirmPassword
            })
            if (response.status === 200){
                history.push('/login');
            }
        } catch (err){
            if(err.response) { 
                setError(err.response.data)
              }
        }     
    }

    return (
        <div className="flexboxVertical loginBox">
            <h1 className="h1Alt hiddenTitle">Say Cheese!</h1>
            <img className="logoPicture" src={cheese} alt="" />
            <h1 className="h1Alt imageText">Register</h1>
            <p className="error">{error}</p>
            <form className="flexboxVertical"> 
                <input value={email} onChange={e => setEmail(e.target.value)} className="inputForm" type="Email" placeholder="Email"/>
                <input value={username} onChange={e => setUsername(e.target.value)} className="inputForm" type="text" placeholder="Username"/>
                <input value={password} onChange={e => setPassword(e.target.value)} className="inputForm" type="Password" placeholder="Password"/>
                <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="inputForm" type="Password" placeholder="Confirm Password"/>
                <div><button onClick={handleSubmit} className="cheeseButton" type="submit"/></div>
            </form>
            <a className= "cheeseLink" href="/Login">Have an account? Login instead!</a>
        </div>
    )
}

export default RegisterBox