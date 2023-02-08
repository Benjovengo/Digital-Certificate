import React from 'react'
import { Container, Row, Col } from "reactstrap";

/// Style
import "./create-id.css"

const CreateId = () => {
  return (
    <>
      <section className='create__id__wrapper'>
        <Container>
          <Row>
            <Col>
              <h1>Create ID</h1>
            </Col>
            <Col>
              <h1>Create ID Form</h1>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default CreateId