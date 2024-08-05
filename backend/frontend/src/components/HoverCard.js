import React from 'react';
import { Modal,Image } from 'react-bootstrap';


const HoverCard = ({ who_can_see,show, handleClose }) => {
    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ruxsat berilgan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {who_can_see.length > 0 ? (
                <div>
                    {who_can_see.map((user, index) => (
                        <div key={index}  style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Image src={user.profile.profile_pic} roundedCircle style={{ width: '50px', height: '50px' }} alt='Profil Rasmi' />{' '}
                            <div className='ms-2'><strong>{user.first_name} {user.last_name}</strong><br></br><small>{user.username}</small></div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No information available.</p>
            )}
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer> */}
        </Modal>
        </>
    );
};

export default HoverCard;
