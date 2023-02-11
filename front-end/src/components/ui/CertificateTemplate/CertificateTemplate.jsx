import React, { useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './certificate-template.css'

const CertificateTemplate = () => {
  return (
    <>
    <Container>
      <div className='template__wrapper'>
        <Row>
          <Col>
            <h2>Diploma</h2>
          </Col>
        </Row>
      </div>
      
    </Container>

    </>
  )
}

export default CertificateTemplate