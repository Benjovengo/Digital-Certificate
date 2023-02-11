import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './display-certificates.css'

// Blockchain integration
import { fetchCertificate } from '../../../scripts/certificates/fetchCertificate';

// Template
import CertificateTemplate from '../CertificateTemplate/CertificateTemplate';

const DisplayCertificates = () => {


  // HARD-CODED
  const options = [
    {value: 1, label: 'Option 1'},
    {value: 2, label: 'Option 2'},
    {value: 3, label: 'Option 3'},
    {value: 4, label: 'Option 4'}
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [area, setArea] = useState('');
  const [advisor, setAdvisor] = useState('');






  const handleSelectCertification = async (event) => {
    setSelectedOption(event.target.value);

    const list = await fetchCertificate()

    setFullName('Fábio Benjovengo')
    setInstitution('Unicamp')



    if (event.target.value === '2') {
      /* console.log('DEBUG 2') */
      setFullName('Fábio Pereira Benjovengo')
      setInstitution('State University of Campinas - Unicamp') 
      /* console.log('Value: ', options[1].value)
      console.log('LAbel: ', options[1].label) */
    } else {
      console.log('DEBUG OTHER:', event.target.value)
    }
  };
  


  return (
    <>
      <section className="display__certificate__wrapper">
        <Container fluid>
          <Row>
            <Col className='d-flex justify-content-center'>
            <h2 className="main__header">Display Certificate</h2>
            <p>Access your certificates and diplomas!</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <select size="10" multiple onChange={handleSelectCertification}>
                {/* <option value="" disabled>Select a Certification</option> */}
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Col>
            <Col xs={9}>
              { (fullName==='') ?
              <>
                <h1>No certificate page!</h1>
              </> : <>
                <CertificateTemplate institution={institution} fullName={fullName} />
              </>
              }
            </Col>
          </Row>
          

        </Container>
      </section>
    </>
  )
}

export default DisplayCertificates