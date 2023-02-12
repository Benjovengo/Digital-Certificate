import React from 'react'
import { Container, Row, Col } from "reactstrap";

/// Style
import "./create-certificate.css"

// Blockchain interaction
import uploadCertificateJSONtoIPFS from '../../../scripts/certificates/uploadCertJsonIPFS';
import { issueNewCertificate } from '../../../scripts/certificates/addCertificate';


const CreateCertificate = () => {
  
  /// Set default values for preview
  window.onload = async function(e) {
    /// Set today's date
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    const today = currentDate.toISOString().substring(0,10);
    document.getElementById('todayDate').value = today
  }

  /**
   * Submit Form - handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Creating a certificate on the blockchain...')

    // Parse form fields
    const institution = e.target.institution.value;
    const blockchainAddress = e.target.blockchainAddress.value;
    const workTitle = e.target.workTitle.value;
    const advisor = e.target.advisor.value;
    const studyingArea = e.target.studyingArea.value;
    const degree = e.target.degree.value;
    const gpa = e.target.gpa.value;
    const date = e.target.date.value;

    // Upload a certificate to IPFS
    const metadata = await uploadCertificateJSONtoIPFS(institution, blockchainAddress, workTitle, advisor, studyingArea, degree, gpa, date);

    const metadataURI = metadata['tokenURI']
    const metadataHash = metadata['hash']


    await issueNewCertificate(blockchainAddress, metadataURI, metadataHash)
    
    console.log('Certificate successfully added!')
  }

  return (
    <>
    <section className='create__certificate__wrapper'>
        <Container>
          <Row>
            <h2 className='main__header'>Create Certificate</h2>
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
                      <label htmlFor="studyingArea">Area/Field</label><br/>
                      <input type="text" id="studyingArea" name="studyingArea" maxLength="200"/>
                    </Col>
                    <Col>
                      <label htmlFor="advisor">Advisor</label><br/>
                      <input type="text" id="advisor" name="advisor" maxLength="200"/>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="degree">Degree</label><br/>
                      <input type="text" id="degree" name="degree" maxLength="200"/>
                    </Col>
                    <Col>
                      <label htmlFor="gpa">GPA (from 0.0 to 4.0)</label><br/>
                      <input type="number" id="gpa" name="gpa" step="0.01" min="0" max="4" placeholder='4.0'/>
                    </Col>
                    <Col>
                      <label htmlFor="todayDate">Date</label><br/>
                      <input type="date" id="todayDate" name="todayDate" disabled/>
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

export default CreateCertificate