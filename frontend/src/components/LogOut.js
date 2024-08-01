// src/components/LogoutButton.js

import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return <Button onClick={handleLogout} variant='danger'>Logout</Button>;
};

export default LogoutButton;
