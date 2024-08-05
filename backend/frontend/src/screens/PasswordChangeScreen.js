import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

function PasswordChangeScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.access) {
            setIsAuthenticated(false);
        }
    }, []);

    if (!isAuthenticated || redirectToLogin) {
        return <Navigate to="/" />;
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== repeatPassword) {
            setMessage('Yangi parol va takroriy parol mos kelmaydi.');
            setMessageType('danger');
            return;
        }
        try {
            await axios.post('/api/password_change/', {
                old_password: oldPassword,
                new_password: newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo')).access}`
                }
            });
            setMessage('Parol muvaffaqiyatli o\'zgartirildi!');
            setMessageType('success');
            localStorage.removeItem('userInfo');
            setTimeout(() => {
                setRedirectToLogin(true);
            }, 1500);
        } catch (error) {
            setMessage('Parolni o\'zgartirish muvaffaqiyatsiz tugadi. Iltimos, qayta urinib ko\'ring.');
            setMessageType('danger');
        }
    };

    return (
        <Container>
            <h2>Parolni o'zgartirish</h2>
            {message && <Alert variant={messageType}>{message}</Alert>}
            <Form onSubmit={handlePasswordChange}>
                <Form.Group controlId="formOldPassword">
                    <Form.Label>Eski Parol</Form.Label>
                    <Form.Control
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        style={{ backgroundColor: '#173036', color: 'white' }}
                    />
                </Form.Group>
                <Form.Group controlId="formNewPassword" className="mt-3">
                    <Form.Label>Yangi Parol</Form.Label>
                    <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ backgroundColor: '#173036', color: 'white' }}
                    />
                </Form.Group>
                <Form.Group controlId="formRepeatPassword" className="mt-3">
                    <Form.Label>Yangi Parolni Takrorlang</Form.Label>
                    <Form.Control
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                        style={{ backgroundColor: '#173036', color: 'white' }}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Parolni O'zgartirish
                </Button>
            </Form>
        </Container>
    );
}

export default PasswordChangeScreen;
