import React from 'react';
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));


    
    const handleLogout = () => {
        navigate('/');
        localStorage.removeItem('userInfo');
    };
  return (
    <header>
        <Navbar expand="lg"  variant='dark' collapseOnSelect>
            <div className='container-fluid'>

            
                <Navbar.Brand className="d-flex align-items-center">
                    {/* <img
                        alt="Het Nav title"
                        src="/icons/title_icon.png"
                        className="d-inline-block align-top me-2 brand-image"
                    /> */}
                    <i class="fa-solid fa-lemon fa-2x d-inline-block align-top me-2 brand-image" style={{color:"yellow"}}></i>
                    {' '}
                    <span className='brand-text'>lemon</span>
                </Navbar.Brand>
                        

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto navbar-link-font">
                        {userInfo?.access && (
                        <>
                            <LinkContainer to='/all_files'>
                                <Nav.Link><i class="fa-solid fa-folder-tree"></i>{' '}Barcha Fayllar</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/my-files'>
                                <Nav.Link><i className="fa-regular fa-folder-open"></i>{' '}Yuklangan Fayllar</Nav.Link>
                            </LinkContainer>
                            
                            <LinkContainer to='/upload-new-file'>
                                <Nav.Link><i class="fa-solid fa-upload"></i>{' '}Fayl Yuklash</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/create-new-group'>
                                <Nav.Link><i class="fa-solid fa-user-plus"></i>{' '}Guruh Yaratish</Nav.Link>
                            </LinkContainer>
                        </>
                            )}
                        </Nav>
                        {userInfo?.access && (
                            <>
                        <Nav className="ms-auto navbar-link-font">
                        <NavDropdown title={userInfo.first_name} id="collapsible-nav-dropdown" drop='start'>
                            <LinkContainer to='/my-profile'>
                            <NavDropdown.Item className='navbar-link-font'>
                                <i className="fa-solid fa-user-pen"></i>{'   '}  Mening Profilim
                            </NavDropdown.Item>
                            </LinkContainer>

                            <LinkContainer to='/change-my-password'>
                            <NavDropdown.Item className='navbar-link-font'>
                                <i className="fa-brands fa-expeditedssl"></i>{'   '} Parolni Uzgartirish
                            </NavDropdown.Item>
                            </LinkContainer>

                            <NavDropdown.Divider />

                            <NavDropdown.Item className='navbar-link-font' onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-to-bracket fa"></i>{'   '} Chiqish
                            </NavDropdown.Item>
                        </NavDropdown>
                </Nav>
                </>
            )}
                </Navbar.Collapse>
            </div>
        </Navbar>
    </header>
  )
}

export default Header