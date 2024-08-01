import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Select from 'react-select';
import {  Row, Col, Form, Button, Alert } from 'react-bootstrap';

function FileUploadScreen() {
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);  // State to keep filenames
    const [comment, setComment] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [message, setMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.access) {
            setIsAuthenticated(false);
            return;
        }

        axios.get('/api/users/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.access}`
            }
        })
        .then(response => setAllUsers(response.data))
        .catch(error => console.log(error));

        axios.get('/api/my_groups/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.access}`
            }
        })
        .then(response => setAllGroups(response.data))
        .catch(error => console.log(error));
    }, []);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(newFiles);
        setFileNames(newFiles.map(file => file.name));  // Update filenames
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        files.forEach(file => formData.append('file', file));  // Append multiple files
        formData.append('comment', comment);
        formData.append('who_can_see', JSON.stringify({
            users: selectedUsers.map(user => user.value),
            groups: selectedGroups.map(group => group.value)
        }));
    
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
        try {
            await axios.post('/api/file_upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userInfo.access}`
                }
            });
            setMessage('Files uploaded successfully');
        } catch (error) {
            setMessage('File upload failed');
        }
    };

    const userOptions = allUsers.map(user => ({
        value: user.id,
        label: user.username
    }));

    const groupOptions = allGroups.map(group => ({
        value: group.group_id,
        label: group.name
    }));

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div style={{height:'40vh'}} className='container  d-flex flex-column'>
            <h2 className="mt-2 mb-2">Fayllar jo'natish</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="formFile">
                    <Form.Label column sm={2}>Fayl(lar) tanlang</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            required
                            style={{ backgroundColor: '#173036', color: 'white' }}
                        />
                        {fileNames.length > 0 && (
                            <ul className="mt-2">
                                {fileNames.map((name, index) => (
                                    <li key={index}>{name}</li>
                                ))}
                            </ul>
                        )}
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formComment" className='mt-2'>
                    <Form.Label column sm={2}>Komment</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            style={{ backgroundColor: '#173036', color: 'white' }}
                            type="text"
                            value={comment}
                            onChange={handleCommentChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formUsers" className='mt-2'>
                    <Form.Label column sm={2}>Kimlarga (Foydalanuvchilar)</Form.Label>
                    <Col sm={10}>
                        <Select
                            isMulti
                            options={userOptions}
                            onChange={setSelectedUsers}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formGroups" className='mt-2'>
                    <Form.Label column sm={2}>Kimlarga (Guruhlar)</Form.Label>
                    <Col sm={10}>
                        <Select
                            isMulti
                            options={groupOptions}
                            onChange={setSelectedGroups}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className='mt-4'>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button variant="primary" type="submit">
                            Yuklash
                        </Button>
                    </Col>
                </Form.Group>
            </Form>

            {message && (
                <Alert variant={message.includes('success') ? 'success' : 'danger'} className="mt-4">
                    {message}
                </Alert>
            )}
        </div>
    );
}

export default FileUploadScreen;
