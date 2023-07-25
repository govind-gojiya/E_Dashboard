import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const Profile = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [pwd, setPWD] = useState("");
    const [img, setIMG] = useState("");
    const [oldImg, setOldImg] = useState("");
    const [changePhoto, setChangePhoto] = useState(false);

    const configHeader = {
        headers: {
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
    };
    const navigate = useNavigate();

    useEffect(() => {
        settingPage();
    }, []);

    const settingPage = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        setName(user.name);
        setEmail(user.email);
        if(user.photo) {
            setOldImg(user.photo);
            document.getElementById('userPic').src = `${apiUrl}/` + user.photo;
        } else {
            const defaultPath = `${apiUrl}/uploads/user.jpg`;
            setOldImg("uploads/user.jpg");
            document.getElementById('userPic').src = defaultPath;
        }
    };

    const updateValues = async () => {

        const id = JSON.parse(localStorage.getItem('user'))._id;
        const userData = new FormData();
        userData.append("name", name);
        userData.append("email", email);
        userData.append("password", pwd);
        userData.append("photo", img);
        userData.append("oldPhoto", oldImg);
        userData.append("id", id);
        userData.append("changePhoto", changePhoto);

        console.warn(userData);
        await axios.post(`${apiUrl}/api/updateUser`, userData, configHeader).then( async (response) => {
            const data = response.data;
            if(data.success) {
                const user = data.response;
                // console.log(data2);
                alert("Profile updated.")
                localStorage.setItem('user', JSON.stringify(user));
                setPWD("");
                document.getElementById('userPic').src = `${apiUrl}/` + user.photo;
                setOldImg(user.photo);
                document.getElementById('fileInput').value = "";
                navigate('/profile');
            } else {
                alert("Something went wrong during updating time... \nError: " + data.error);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const changeImg = (e) => {
        // document.getElementById('userPic').src = e.target.files[0];
        // console.warn(e.target.files[0]);
        setIMG(e.target.files[0]);
        setChangePhoto(true);
    }
    return(
        <div className="profilePage">
            <div className="box">
                <h1>Profile</h1>
                <div className='profileBox'>

                <div className='userPhoto'>
                    <img src="" id="userPic" alt="user-photo" />
                </div>

                <div className="userDetails">
                    <input type="text" value={name}
                    onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />

                    <input type="text" value={email} readOnly="true" />

                    <input type="password" value={pwd}
                    onChange={(e) => setPWD(e.target.value)} placeholder="Enter New password" />

                    <input type="file" id="fileInput" onChange={(e) => changeImg(e)} />

                    <button onClick={updateValues} type="button">Save</button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Profile