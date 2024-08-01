import React, { useState } from 'react';
import { ListGroup, Row, Col, Image, Modal } from 'react-bootstrap';
import { format } from 'date-fns';


function ListGroupItem({ group }) {
  const formattedDate = format(new Date(group.created), 'dd/MM/yyyy HH:mm');
  // State to manage modal visibility
  const [showModal, setShowModal] = useState(false);

  // Handle showing the modal
  const handleShow = () => setShowModal(true);

  // Handle hiding the modal
  const handleClose = () => setShowModal(false);

  return (
    <>
      <ListGroup.Item className='group-list-item' onClick={handleShow} style={{ cursor: 'pointer' }}>
        <Row>
          <Col className='col-3'>
            <Image src={group.picture} roundedCircle style={{ width: '7vh', height: '7vh' }} alt='Profil Rasmi' />
          </Col>
          <Col className='col-9'>
            <Row>
              <Col>
                <h5>{group.name} <small>({group.members.length})</small></h5>
              </Col>
            </Row>
            <Row>
              <Col className='text-muted'>
                <small>{formattedDate}</small>
              </Col>
            </Row>
          </Col>
        </Row>
      </ListGroup.Item>

      {/* Modal for displaying group details */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{group.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className='col-9'>
              {group.members.length > 0 ? (
                <div>
                    {group.members.map((user, index) => (
                        <div key={index}  style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Image src={user.profile.profile_pic} roundedCircle style={{ width: '60px', height: '60px' }} alt='Profil Rasmi' />{' '}
                            <div className='ms-2'><strong>{user.first_name} {user.last_name}</strong><br></br><small>{user.username}</small></div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No information available.</p>
            )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListGroupItem;
