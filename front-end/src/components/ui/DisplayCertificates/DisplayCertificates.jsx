import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './display-certificates.css'

// Blockchain integration
import { fetchCertificatesList, fetchCertificateJSON } from '../../../scripts/certificates/fetchCertificate';
import { fetchIdentity } from '../../../scripts/identity/fetchIdentity';

// Template
import CertificateTemplate from '../CertificateTemplate/CertificateTemplate';

const DisplayCertificates = () => {

  /** Hooks
   * 
   */
  // const [selectedOption, setSelectedOption] = useState(null);
  // Hooks for the entire list of certificates associated with the logged account
  const [selectLength, setSelectLength] = useState(0);
  const [headers, setHeaders] = useState([]); // headers for the certificates
  // Per certificate hooks
  const [certificateId, setCertificateId] = useState('');
  const [institution, setInstitution] = useState('');
  const [fullName, setFullName] = useState('');
  const [blockchainAddress, setBlockchainAddress] = useState('');
  const [degree, setDegree] = useState('');
  const [area, setArea] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [hash, setHash] = useState('');
  const [txHash, setTxHash] = useState('');
  const [dateString, setDateString] = useState('');


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
    //setCertificateArray(list)

    let certificateHeaders = [] // placeholder for the headers objects
    let JSON // placeholder for the TokenURI

    // loop through all the certificates
    for (let i = 0; i < list.length; i++) {
      JSON = await fetchCertificateJSON(list[i])
      certificateHeaders.push({value: list[i], label: JSON.degree + ' - ' + JSON.institution})
    }

    // Set hook for the size of the select multiple element
    setSelectLength(Math.min(list.length,20))
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
    // console.log(JSON)

    const identity = await fetchIdentity()
    //console.log(identity)

    let identityName = (identity? identity.firstName + ' ' + identity.lastName : 'Identity Not Found')

        /// Get today's date
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate());
        const today = currentDate.toISOString().substring(0,10);
        // Display date
        const certDate = (JSON.date? JSON.date : today)
        const date = new Date(certDate + 'T00:00:00');
        const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        };
        const dateString = date.toLocaleDateString('en-US', options);
        setDateString(dateString)

    

    // Set hooks
    setCertificateId(serialNumber)
    setInstitution(JSON.institution)
    setFullName(identityName)
    setBlockchainAddress(JSON.blockchainAddress)
    setDegree(JSON.degree)
    setArea(JSON.studyingArea)
    setAdvisor(JSON.advisor)
    setHash(JSON.hash)
    setTxHash(JSON.txHash)
  };
  


  return (
    <>
      <section className="display__certificate__wrapper">
        <Container fluid>
          <Row>
            <Col className='d-flex justify-content-center'>
              <h2 className="main__header">Display Certificate</h2>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex justify-content-center'>
              <p>Access your certificates and diplomas anywhere!</p>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col md={3} className='text-center'>
              <h3>Select a certificate</h3>
              <p className='certifications__list'>from the list of certifications below</p>
              <select className='select__certificate' size={selectLength.toString()} multiple onChange={handleSelectCertification}>
                {(headers.length===0)? <option value="" disabled>No certification registered!!!</option> : 
                headers.map((option, index) => (
                  <option key={index} title={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Col>
            <Col xs={9}>
              { (fullName==='') ?
              <>
                <Row className='justify-content-center mt-5'>
                  <Col className='text-center'>
                    <h2>Please select a certification!</h2>
                    <p>Select a certification from the list on the left to show the information.</p>
                  </Col>
                </Row>
                
              </> : <>
                <CertificateTemplate institution={institution} fullName={fullName} blockchainAddress={blockchainAddress} degree={degree} area={area} advisor={advisor} certificateId={certificateId} hash={hash} date={dateString} txHash={txHash} />
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