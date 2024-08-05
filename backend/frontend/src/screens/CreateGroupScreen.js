import React, { useEffect, useState } from 'react';
import { Form, ListGroup, InputGroup, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import ListGroupItem from '../components/ListGroupItem';
import CreateGroupForm from '../components/CreateGroupForm';

function CreateGroupScreen() {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchGroups = async (userInfo) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.access}`
                },
            };
            const { data } = await axios.get('/api/my_groups/', config);
            setGroups(data);
            setFilteredGroups(data); // Initialize filteredGroups with all groups
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleGroupCreated = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.access) {
            setIsAuthenticated(false);
            return;
        }
        fetchGroups(userInfo);
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.access) {
            setIsAuthenticated(false);
            return;
        }
        fetchGroups(userInfo);
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredGroups(groups.filter(group => group.name.toLowerCase().includes(query)));
    };

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <Row className='border d-flex flex-row p-5'>
            <Col xs={12} md={6} lg={4}>
                <div className="card border-secondary mb-3">
                    <div className="card-header">Mening Guruhlarim</div>
                    <div className="card-body">
                        <Row className="card-title p-3">
                            <div className='d-flex flex-row align-items-center'>
                                <InputGroup>
                                    <Form.Control 
                                        placeholder="Guruh nomi . . ."
                                        aria-label="Recipient's group name with two button addons"
                                        style={{ backgroundColor: '#173036', color: 'white' }}
                                        onChange={handleSearchChange}
                                        value={searchQuery}
                                    />
                                </InputGroup>
                            </div>
                        </Row>
                        <Row className="p-3">
                            <div className='group-scrollbar d-flex flex-column align-items-center border p-1 w-100'>
                                <ListGroup className='w-100 px-2'>
                                    {filteredGroups.map((group, index) => (
                                        <ListGroupItem key={index} group={group} />
                                    ))}
                                </ListGroup>
                            </div>
                        </Row>
                    </div>
                </div>
            </Col>
            <Col xs={12} md={6} lg={8}>
                <CreateGroupForm onGroupCreated={handleGroupCreated} />
            </Col>
        </Row>
    );
}

export default CreateGroupScreen;
