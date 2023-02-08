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
            <Col xs={8}>
              <h1>Create ID Form</h1>
              <form>
                <Row>
                  <Col>
                    <label htmlFor="firstName">First name:</label><br/>
                    <input type="text" id="firstName" name="firstName"></input>
                  </Col>
                  <Col>
                    <label htmlFor="lastName">Last name:</label><br/>
                    <input type="text" id="lastName" name="lastName"></input>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label htmlFor="issuedBy">Issued by:</label><br/>
                    <input type="text" id="issuedBy" name="issuedBy"></input>
                  </Col>
                  <Col>
                    <label htmlFor="issuedDate">Issue date:</label><br/>
                    <input type="date" id="vacDate" disabled></input>
                  </Col>
                </Row>
                <Row>
                  <button className='submit'>Create ID</button>
                </Row>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default CreateId