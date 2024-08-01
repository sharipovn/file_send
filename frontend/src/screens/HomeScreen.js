import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import TableRow from '../components/TableRow';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function HomeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFiles = async () => {
    console.log('Fetching files...');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.access) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.access}`
        },
      };
      const { data } = await axios.get('/api/all_files/', config);
      console.log('Files fetched:', data);
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFileDeleted = (fileId) => {
    console.log('File deleted:', fileId);
    setFiles((prevFiles) => prevFiles.filter(file => file.file_id !== fileId));
    window.location.reload()
  };

  const filteredFiles = files.filter(file =>
    file.sender.username.toLowerCase().includes(searchTerm) ||
    file.file_name.toLowerCase().includes(searchTerm) ||
    formatDate(file.created).includes(searchTerm)
  );

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className='container-fluid border'>
      <Row className='mt-5 d-flex flex-row align-items-center'>
        <div className='col-4'>
          <InputGroup>
            <Form.Control
              placeholder="Fayl nomi, yuborgan ismi yoki yuborilgan vaqti . . ."
              aria-label="Recipient's username with two button addons"
              style={{ backgroundColor: '#173036', color: 'white' }}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </div>
        <div className='col-4 d-flex justify-content-start ms-5'>
          <Button variant="primary" onClick={fetchFiles}><i className="fa-solid fa-rotate-right"></i>{' '}Yangilash</Button>
        </div>
      </Row>
      <Row className='mt-5'>
        <div className="table-scrollbar">
          <table className="table table-sm table-striped table-hover table-bordered border-secondary-emhasis">
            <thead>
              <tr>
                <th className="custom-cell bg-info">#</th>
                <th className="custom-cell bg-info">
                  <img src="/icons/person.png" alt="icon" style={{ width: '25px', height: '25px' }} />{' '}
                  Yuboruvchi
                </th>
                <th className="custom-cell bg-info">
                  <img src="/icons/files.png" alt="icon" style={{ width: '20px', height: '20px' }} />{' '}
                  Fayl nomi
                </th>
                <th className="custom-cell bg-info">
                  <img src="/icons/comment.png" alt="icon" style={{ width: '20px', height: '20px' }} />{' '}
                  Komment
                </th>
                <th className="custom-cell bg-info">
                  <img src="/icons/clock.png" alt="icon" style={{ width: '20px', height: '20px' }} />{' '}
                  Yuborilgan
                </th>
                <th className='custom-cell bg-info'>Fayl o'lchami</th>
                <th className='custom-cell bg-info'>Ko'ra oladi</th>
                <th className='custom-cell bg-info'>Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <TableRow 
                  key={file.file_id} 
                  page_type={'all'} 
                  file={file} 
                  index={index} 
                  onFileDeleted={handleFileDeleted} // Pass the callback
                />
              ))}
            </tbody>
          </table>
        </div>
      </Row>
    </div>
  );
}

export default HomeScreen;
