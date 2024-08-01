import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Image, Row, Col } from 'react-bootstrap';


function ProfileUpdateScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        // Check if user is authenticated
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.access) {
            setIsAuthenticated(false);
            return;
        }

        // Fetch user profile data if authenticated
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/user_profile/', {
                    headers: {
                        'Authorization': `Bearer ${userInfo.access}`
                    }
                });
                const { first_name, last_name, email, profile, username } = response.data;
                setFirstName(first_name);
                setLastName(last_name);
                setEmail(email);
                setProfilePicUrl(profile.profile_pic); // Set the profile picture URL
                setUsername(username);
            } catch (error) {
                setMessage('Profil ma\'lumotlarini yuklab olishda xatolik yuz berdi.');
                setMessageType('danger');
            }
        };

        fetchUserProfile();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('email', email);
        if (profilePic) {
            formData.append('profile_pic', profilePic);
        }
    
        try {
            await axios.patch('/api/update_profile/', formData, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo')).access}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Profil muvaffaqiyatli yangilandi!');
            setMessageType('success');

            // Refetch the profile data
            const response = await axios.get('/api/user_profile/', {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo')).access}`
                }
            });
            const { first_name, last_name, email, profile, username } = response.data;
            setFirstName(first_name);
            setLastName(last_name);
            setEmail(email);
            setProfilePicUrl(profile.profile_pic); // Update the profile picture URL
            setUsername(username);
        } catch (error) {
            setMessage('Profilni yangilashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
            setMessageType('danger');
        }
    };
    
    return (
        <Container>
            <h2>Profilni Yangilash</h2>
            {message && <Alert variant={messageType}>{message}</Alert>}
            <Row className="align-items-center">
                <Col md={4} className="text-center">
                    {profilePicUrl && (
                        <div className="profile-pic-container mb-3">
                            <Image src={profilePicUrl} alt="Profile" className="profile-pic" />
                        </div>
                    )}
                    <h4 className="mt-2">{username}</h4>
                </Col>
                <Col md={8}>
                    <Form onSubmit={handleProfileUpdate}>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>Ism</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                style={{ backgroundColor: '#173036', color: 'white' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mt-3">
                            <Form.Label>Familiya</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                style={{ backgroundColor: '#173036', color: 'white' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ backgroundColor: '#173036', color: 'white' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProfilePic" className="mt-3">
                            <Form.Label>Profil Rasm</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setProfilePic(e.target.files[0])}
                                style={{ backgroundColor: '#173036', color: 'white' }}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Profilni Yangilash
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ProfileUpdateScreen;
