import React, { useEffect, useState } from 'react';
import {Form,Button,InputGroup,Row,Table} from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import TableRow from '../components/TableRow'




function MyFilesScreen() {

  
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  

  
  const fetchFiles = async (userInfo) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.access}`
        },
      };
      const { data } = await axios.get('/api/my_files/', config);
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.access) {
          setIsAuthenticated(false);
          return;
      }
    fetchFiles(userInfo);
  }, []);

  
  const refreshFiles = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.access) {
          setIsAuthenticated(false);
          return;
      }
    fetchFiles(userInfo);
  };
    
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredFiles = files.filter(file =>
    file.sender.username.toLowerCase().includes(searchTerm) ||
    file.file_name.toLowerCase().includes(searchTerm)
  );


  return (
    
      <div className='container-fluid border'>
            <Row className='mt-5 d-flex flex-row align-items-center'>
              <div className='col-4'>
                <InputGroup>
                  <Form.Control
                    placeholder="Fayl nomi yoki yuborgan ismi . . ."
                    aria-label="Recipient's username with two button addons"
                    style={{ backgroundColor: '#173036',color: 'white'  }}
                    onChange={handleSearchChange}
                    />
                </InputGroup>
              </div>
          <div className='col-4 d-flex justify-content-start ms-5'>
            <Button variant="primary"  onClick={refreshFiles}><i class="fa-solid fa-rotate-right"></i>{' '}Yangilash</Button>
          </div>
        </Row>
        <Row className='mt-5'>
        <Table striped bordered hover responsive variant="dark" >
          <thead>
            <tr>
              <th  className="custom-cell bg-info">#</th>
              <th className="custom-cell bg-info">
              <img src="/icons/files.png" alt="icon" style={{ width:'20px',height:'20px'}} />{' '}
              Fayl nomi</th>
              <th className="custom-cell bg-info">
              <img src="/icons/comment.png" alt="icon" style={{width:'20px',height:'20px'}} />{' '}
                Komment
              </th>
              <th className="custom-cell bg-info"><img src="/icons/clock.png" alt="icon" style={{ width: '20px', height: '20px' }} />{' '}Yuborilgan</th>
              <th className='custom-cell bg-info'>Fayl o'lchami</th>
              <th className='custom-cell bg-info'>Ko'ra oladi</th>
              <th className='custom-cell bg-info'>Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file, index) => (
             <TableRow  page_type={'me'} file={file} index={index} />
            ))}
          </tbody>
        </Table>
        </Row>
      </div>
  )
}

export default MyFilesScreen;