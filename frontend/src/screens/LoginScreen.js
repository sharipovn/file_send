import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/loginActions';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        await login(username, password); // Await the login action
        navigate('/all_files'); // Redirect on successful login
    } catch (error) {
        // Extract and display the error message
        setError(error.message || 'An error occurred. Please try again.');
    }
};

  return (
    <FormContainer>
      <div className='text-center'>
        <img
          alt="File Send title"
          src="./icons/login_title.png"
          className="d-inline-block align-top me-2"
          style={{height: '300px', width: '300px'}}
        />
      </div>
      {/* <h1 className='text-center'>Xush Kelibsiz</h1> */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleLogin}>
        <Form.Group controlId='username'>
          <Form.Label>Foydalanuvchi nomi</Form.Label>
          <Form.Control 
            type='text'
            placeholder='Foydalanuvchi nomini kiriting ...'
            value={username}
            style={{ backgroundColor: '#1a343a', borderColor: '#1a343a', color: 'white' }}
            onChange={(e) => setUsername(e.target.value)}
            required // Make this field required
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Parol</Form.Label>
          <Form.Control
            type='password'
            placeholder='Parolni kiriting ...'
            value={password}
            style={{ backgroundColor: '#1a343a', borderColor: '#1a343a', color: 'white' }}
            onChange={(e) => setPassword(e.target.value)}
            required // Make this field required
          />
        </Form.Group>
        <Button type='submit' variant='info' className='mt-3 col-12'>Kirish</Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Yangi Foydalanuvchimisiz ? <Link to='/register'>Ro'yhatdan o'tish</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;
