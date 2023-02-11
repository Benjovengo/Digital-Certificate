import React from 'react'
import { Container, Row, Col } from "reactstrap";

import './display-certificates.css'


const DisplayCertificates = () => {
  return (
    <>
      <section className="display__certificate__wrapper">
        <Container fluid>
          <Row>
            <h2 className="main__header">Display Certificate</h2>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default DisplayCertificates