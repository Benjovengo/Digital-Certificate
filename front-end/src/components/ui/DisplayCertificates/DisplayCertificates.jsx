import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './display-certificates.css'

// Blockchain integration
import { fetchCertificatesList, fetchCertificateJSON } from '../../../scripts/certificates/fetchCertificate';

// Template
import CertificateTemplate from '../CertificateTemplate/CertificateTemplate';

const DisplayCertificates = () => {

  /** Hooks
   * 
   */
  // const [selectedOption, setSelectedOption] = useState(null);
   // Hooks for the entire list of certificates associated with the logged account
   const [certificateArray, setCertificateArray] = useState([]); // array of the serial numbers of the certificates
   const [headers, setHeaders] = useState([]); // headers for the certificates
  // Per certificate hooks
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [area, setArea] = useState('');
  const [advisor, setAdvisor] = useState('');


  /** Update (on loading) the list of certificates to be selected */
  useEffect(()=>{
    certificatesHeader()
   },[])



   /** Get the headline fort the certificates owned by the logged address
    * 
    * @dev set hook to be used on the 'select multiple' element
    */
  const certificatesHeader = async () => {
    const list = await fetchCertificatesList() // list of certificates for the logged account
    setCertificateArray(list)

    let certificateHeaders = [] // placeholder for the headers objects
    let JSON // placeholder for the TokenURI

    // loop through all the certificates
    for (let i = 0; i < list.length; i++) {
      JSON = await fetchCertificateJSON(list[i])
      certificateHeaders.push({value: list[i], label: JSON.institution + ' - ' + JSON.degree})
    }

    // Set hook for the headers to be used on the 'select' element
    setHeaders(certificateHeaders)
  }


  /** Select a certification to be displayed
   * 
   * @param {event} event Properties of the 'select' element
   */
  const handleSelectCertification = async (event) => {
    // setSelectedOption(event.target.value);

    const serialNumber = Number(event.target.value)
    const JSON = await fetchCertificateJSON(serialNumber)

    console.log(JSON)

    setFullName('Fábio Benjovengo')
    setInstitution('Unicamp')

    if (event.target.value === '2') {
      /* console.log('DEBUG 2') */
      setFullName('Fábio Pereira Benjovengo')
      setInstitution('State University of Campinas - Unicamp') 
      /* console.log('Value: ', headers[1].value)
      console.log('LAbel: ', headers[1].label) */
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
                {headers.map((option, index) => (
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