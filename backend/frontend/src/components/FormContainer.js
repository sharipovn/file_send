import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'

function FormContainer({children}) {
  return (
    <Container>
        <Row className='d-flex flex-column align-items-center justify-content-center main-part '>
            <Col xs={12} md={5} xl={5}>
                {children}
            </Col>
        </Row>
    </Container>
  )
}

export default FormContainer