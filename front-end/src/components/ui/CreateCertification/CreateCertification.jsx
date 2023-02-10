import React from 'react'
import { Container, Row, Col } from "reactstrap";

/// Style
import "./create-certification.css"

// Blockchain interaction
import uploadCertificationJSONtoIPFS from '../../../scripts/certificates/uploadCertJsonIPFS';
import { issueNewCertification } from '../../../scripts/certificates/addCertificate';


const CreateCertification = () => {
  

  /**
   * Submit Form - handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Creating a certification on the blockchain...')

    //javascript file to add a certificate
    const institution = e.target.institution.value;
    const blockchainAddress = e.target.blockchainAddress.value;
    const workTitle = e.target.workTitle.value;
    const advisor = e.target.advisor.value;
    const coAdvisor = e.target.coAdvisor.value;
    const degree = e.target.degree.value;
    const gpa = e.target.gpa.value;
    const date = e.target.date.value;
    
    const metadata = await uploadCertificationJSONtoIPFS(institution, blockchainAddress, workTitle, advisor, coAdvisor, degree, gpa, date);

    const metadataURI = metadata['tokenURI']
    const metadataHash = metadata['hash']


    await issueNewCertification(metadataURI, metadataHash)
    
    console.log('Certification successfully added!')
  }

  return (
    <>
    <section className='create__certification__wrapper'>
        <Container>
          <Row>
            <h2 className='main__header'>Create Certification</h2>
              <form onSubmit={handleSubmit}>
                <div className="form__wrapper">
                  <Row>
                    <Col>
                      <label htmlFor="institution">Institution</label><br/>
                      <input type="text" id="institution" name="institution" maxLength="100" placeholder='The Blockchain University' required/>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="blockchainAddress">Address (of the owner of the certificate)</label><br/>
                      <input type="text" id="blockchainAddress" name="blockchainAddress" maxLength="42" placeholder='0x000000000000000000000000000000000000000000000000' required />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="workTitle">Title of the work</label><br/>
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
              </form>
          </Row>
        </Container>
      </section>

    </>

  )
}

export default CreateCertification