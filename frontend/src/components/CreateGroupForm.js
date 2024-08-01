import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomOption from '../components/CustomOption'; // Import your CustomOption component

const animatedComponents = makeAnimated();

const MultiValue = (props) => {
    return (
        <components.MultiValue {...props}>
            <span>{props.data.label}</span>
        </components.MultiValue>
    );
};

const CreateGroupForm = ({ onGroupCreated }) => {
    const [groupName, setGroupName] = useState('');
    const [picture, setPicture] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
    }, []);

    const handleGroupCreation = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', groupName);

        if (picture) {
            formData.append('picture', picture);
        }

        selectedMembers.forEach(member => {
            formData.append('members', member.value);
        });

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.access) {
            setIsAuthenticated(false);
            return;
        }

        axios.post('/api/create_group/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo.access}`
            }
        })
        .then(response => {
            setSuccess('Group created successfully!');
            setError('');
            setGroupName('');          // Clear group name input
            setPicture(null);         // Clear picture input
            setSelectedMembers([]);  // Clear selected members

            if (onGroupCreated) {
                onGroupCreated(); // Notify parent that a new group has been created
            }
        })
        .catch(error => {
            setError('Guruh yaratishda xatolik : ' + JSON.stringify(error.response.data));
            setSuccess('');
        });
    };

    const handleMemberSelection = (selectedOptions) => {
        setSelectedMembers(selectedOptions || []);
    };

    const handleSelectAll = () => {
        setSelectedMembers(allUsers.map(user => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name} (${user.username})`
        })));
    };

    const handleDeselectAll = () => {
        setSelectedMembers([]);
    };

    // Prepare options with full names
    const userOptions = allUsers.map(user => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name} (${user.username})`
    }));

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <Container>
            <h2 className="mt-4">Yangi Guruh Yaratish</h2>
            {error && <Alert className="alert alert-dismissible alert-light">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleGroupCreation}>
                <Form.Group as={Row} className="mb-3" controlId="formGroupName">
                    <Form.Label column sm={2}>Guruh Nomi:</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGroupPicture">
                    <Form.Label column sm={2}>Guruh Rasmi:</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="file"
                            onChange={(e) => setPicture(e.target.files[0])}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formGroupMembers">
                    <Form.Label column sm={2}>Guruh azolari:</Form.Label>
                    <Col sm={10}>
                        <div className="mb-3">
                            <Button variant="outline-primary" size="sm" onClick={handleSelectAll}>Barchani Tanlash</Button>
                            <Button variant="outline-secondary" size="sm" className="ms-2" onClick={handleDeselectAll}>Bekor Qilish</Button>
                        </div>
                        <Select
                            placeholder="Tanlash..."
                            isMulti
                            options={userOptions}
                            value={selectedMembers}
                            onChange={handleMemberSelection}
                            components={{ Option: CustomOption, MultiValue, animatedComponents }}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            controlShouldRenderValue={true}
                            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
                        />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">Yaratish</Button>
            </Form>
        </Container>
    );
};

export default CreateGroupForm;
