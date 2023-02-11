import React, { useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './certificate-template.css'

const CertificateTemplate = ({ institution, fullName }) => {
  return (
    <>
    <Container>
      <div className='template__wrapper'>
        <Row>
          <Col>
            <h1>{institution}</h1>
            <h2>{fullName}</h2>
            <p>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</p>
            <h2>Degree</h2>
            <h2>Area</h2>
            <h3>Advisor</h3>
          </Col>
        </Row>
      </div>
      
    </Container>

    </>
  )
}

export default CertificateTemplate