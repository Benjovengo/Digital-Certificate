import React from 'react'
import { Container, Row, Col } from "reactstrap";

/// Style
import "./create-certification.css"



const CreateCertification = () => {
  

  return (
    <>
    <section className='create__certification__wrapper'>
        <Container>
          <Row>
            <h1>Create Certification</h1>
              <Col>
                <div className="form__wrapper">
                  <Row>
                    <Col>
                      <label htmlFor="institution">Institution</label><br/>
                      <input type="text" id="institution" name="institution" maxLength="100" required/>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="blockchainAddress">Address</label><br/>
                      <input type="text" id="blockchainAddress" name="blockchainAddress" maxLength="42" placeholder='0x000000000000000000000000000000000000000000000000' required />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="workTitle">Title</label><br/>
                      <input type="text" id="workTitle" name="workTitle" maxLength="200" placeholder='Sliding mode approaches for the longitudinal control of an autonomous robotic blimp'/>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="advisor">Advisor</label><br/>
                      <input type="text" id="advisor" name="advisor" maxLength="200"/>
                    </Col>
                    <Col>
                      <label htmlFor="coAdvisor">Co-advisor</label><br/>
                      <input type="text" id="coAdvisor" name="coAdvisor" maxLength="200"/>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="degree">Degree</label><br/>
                      <input type="text" id="degree" name="degree" maxLength="200"/>
                    </Col>
                    <Col>
                      <label htmlFor="gpa">GPA</label><br/>
                      <input type="number" id="gpa" name="gpa" placeholder='4.0'/>
                    </Col>
                    <Col>
                      <label htmlFor="date">Date</label><br/>
                      <input type="date" id="date" name="date" disabled/>
                    </Col>
                  </Row>
                  <Row>
                    <Col className='mt-5 d-flex justify-content-end'>
                      <button className='submit__btn submit'>Add certificate</button>
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