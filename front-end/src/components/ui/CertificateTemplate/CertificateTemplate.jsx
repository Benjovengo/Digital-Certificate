import React, { useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './certificate-template.css'

const CertificateTemplate = ({ institution, fullName, blockchainAddress, degree, area, advisor }) => {
  return (
    <>
    <Container>
      <div className='template__wrapper'>
        <Row>
          <Col>
            <h1>{institution}</h1>
            <h2>{fullName}</h2>
            <p>{blockchainAddress}</p>
            <h2>{degree}</h2>
            <h2>{area}</h2>
            <h3>{advisor}</h3>
          </Col>
        </Row>
      </div>
      
    </Container>

    </>
  )
}

export default CertificateTemplate