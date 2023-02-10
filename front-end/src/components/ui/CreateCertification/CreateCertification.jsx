import React, { useEffect } from 'react'
import { Container, Row, Col } from "reactstrap";

/// Style
import "./create-certification.css"



const CreateCertification = () => {
  
  

  return (
    <>
    <section className='create__id__wrapper'>
        <Container fluid>
          <Row>
            <h1>CreateCertification</h1>
              <Col>
                <div className="form__wrapper">
                  <Row>
                    <Col>
                      <label htmlFor="institution">Institution</label><br/>
                      <input type="text" id="institution" name="institution" maxLength="100" required></input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="title">Title</label><br/>
                      <input type="text" id="title" name="title" maxLength="200" defaultValue={'Sliding mode approaches for the longitudinal control of an autonomous robotic blimp'}></input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="advisor">Advisor</label><br/>
                      <input type="text" id="advisor" name="advisor" maxLength="200"></input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="degree">Degree</label><br/>
                      <input type="text" id="degree" name="degree" maxLength="200"></input>
                    </Col>
                    <Col>
                      <label htmlFor="gpa">GPA</label><br/>
                      <input type="number" id="gpa" name="gpa"></input>
                    </Col>
                    <Col>
                      <label htmlFor="date">Date</label><br/>
                      <input type="date" id="date" name="date" disabled></input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <button className='submit'>Add certificate</button>
                    </Col>
                  </Row>
                </div>
              </Col>
          </Row>
        </Container>
      </section>

    </>

  )
}

export default CreateCertification