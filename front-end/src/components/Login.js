import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {

    const [email,setEmail] = useState("");
    const [pwd, setPWD] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('user')) {
            navigate('/');
        }
    }, [])

    const logedIn = async () => {
        // console.warn(email, pwd);

        const result = await fetch(`${apiUrl}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password: pwd
            })
        });
        const data = await result.json();
        console.warn("data", data);
        const user = data.response;
        const token = data.auth;

        if(data.success) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', JSON.stringify(token));
            navigate('/');
        } else {
            alert(data.error);
        }
    }
    return(
        <div className="loginPage">
            <div className="box">
                <h1>Login</h1>

                <input type="text" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

                <input type="password"value={pwd}
                onChange={(e) => setPWD(e.target.value)} placeholder="Enter your password" />

                <button onClick={logedIn} type="button">Login</button>
            </div>
        </div>
    )
}

export default Login;