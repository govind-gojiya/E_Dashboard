import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const SignUp = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [pwd, setPWD] = useState("");
    const [img, setIMG] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('user') && localStorage.getItem('token')) {
            navigate('/');
        }
    })

    const showValues = async () => {
        console.warn(name, email, pwd);

        const userData = new FormData();
        userData.append("name", name);
        userData.append("email", email);
        userData.append("password", pwd);
        userData.append("photo", img);

        console.warn(userData);
        await axios.post(`${apiUrl}/api/register`, userData).then((response) => {
            
            const data = response.data;
            if(data.success) {
                // console.warn("data", data);
                const user = data.response;
                const token = data.auth;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', JSON.stringify(token));
                navigate('/');
            } else {
                alert("Something went wrong \nError: " + data.error);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    return(
        <div className="registerPage">
            <div className="box">
                <h1>Register</h1>

                <input type="text" value={name}
                onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />

                <input type="text" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

                <input type="password" value={pwd}
                onChange={(e) => setPWD(e.target.value)} placeholder="Enter your password" />

                <input type="file" onChange={(e) => setIMG(e.target.files[0])} />

                <button onClick={showValues} type="button">Sign Up</button>
            </div>
        </div>
    )
}

export default SignUp;