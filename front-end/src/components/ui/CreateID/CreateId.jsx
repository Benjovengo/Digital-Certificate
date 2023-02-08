import React, { useEffect, useState } from  'react'
import { Container, Row, Col } from "reactstrap";

/// Style
import "./create-id.css"

const CreateId = () => {

  /// Set today's date
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  var today = currentDate.toISOString().substring(0,10);


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
                    <label htmlFor="issuedDate" id='dateInput'>Issue date:</label><br/>
                    <input id="issueDate" type="date" name="issueDate" defaultValue={today} disabled/> 
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