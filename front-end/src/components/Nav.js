import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Logo from './Logo';

const Nav = () => {
    const auth = localStorage.getItem('user');
    const auth2 = localStorage.getItem('token');

    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/signup');
    };

    return (
        <div>
            {/* <img alt="anime-logo" className='logoImg' */}
             {/* src='https://i.pinimg.com/564x/db/49/1b/db491b0b84fac88558c77773e64c1e25.jpg' /> */}
            <Logo />
            { auth && auth2 ? 
            <ul className='navBar-ul'>
                {/* <li><Logo /></li> */}
                <li><Link to="/">Product</Link></li>
                <li><Link to="/add">Add Product</Link></li>
                <li><Link to="/update">Update Product</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li className='right-padding'><Link onClick={logout} to="/signup">Logout ( {JSON.parse(auth).name} )</Link></li>
            </ul>
            :
            <ul className='navBar-ul'>
                {/* <li><Logo /></li> */}
                <li><Link to="/signup">Get Started</Link></li>
                <li className='right-padding'><Link to="/login">Login</Link></li>
            </ul>
            }
        </div>
    )
}

export default Nav;