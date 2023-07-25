import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
    const auth = localStorage.getItem('user');
    const auth2 = localStorage.getItem('token');

    return auth && auth2 ? <Outlet /> : <Navigate to="/signup" />;
};

export default PrivateRoute;