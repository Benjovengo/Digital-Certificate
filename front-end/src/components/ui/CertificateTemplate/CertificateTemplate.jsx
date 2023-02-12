import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col } from "reactstrap";
import html2pdf from 'html2pdf.js'

import './certificate-template.css'
import universityBadge from '../../../assets/images/university_badge_signed.png'

/// QR code generation
var QRCode = require('qrcode')


const CertificateTemplate = ({ institution, fullName, blockchainAddress, degree, area, advisor, certificateId, hash, date }) => {


  useEffect(() => {
    var canvas = document.getElementById('canvas')

    QRCode.toCanvas(canvas, hash, function (error) {
      if (error) console.error(error)
    })
  }, [hash])

  /**
   * Export certificate to pdf
   */
  function handleExport() {
    // Choose the element id which you want to export.
    var element = document.getElementById('divToExport');
    /* element.style.width = '700px';
    element.style.height = '900px'; */
    var opt = {
        margin:       0.5,
        filename:     `Certificate_${fullName.replace(/\s+/g, '')}_from.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 1 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape',precision: '12' }
      };
    
    // choose the element and pass it to html2pdf() function and call the save() on it to save as pdf.
    html2pdf().set(opt).from(element).save();
  }



  return (
    <>
    <Container>
      <div className='template__wrapper' id="divToExport">
        <Row>
          <div className="inner__wrapper">
            <Row>
              <Col className='d-flex justify-content-center'>
                <h1>{institution}</h1>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <p>The Board of trustees of {institution}, upon recommendation of the faculty, in particular professor {advisor} (advisor), has conferred upon</p>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <h2>{fullName}</h2>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <p className='account__address'>{blockchainAddress}</p>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <p>the degree of</p>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <h2>{degree}</h2>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <p className='degree__in__area'>in</p>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <h2>{area}</h2>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <p>With all the rights, honors, and privileges thereunto appertaining. In witness whereof, the seal of the University and the signatures as authorizes by the Board of Trustees, {institution}, are hereunto affixed, this {date}.</p>
              </Col>
            </Row>
            <Row>
              <Col className='d-flex justify-content-center'>
                <img src={universityBadge} alt="badge" className='university__badge__img' />
              </Col>
            </Row>
          </div>
        </Row>
        <Row>
          <Col className='d-flex justify-content-center'>
            <h2>Certificate Serial Number: {certificateId}</h2>
            <h3><br/>Etherscan Link - put QR Code</h3>
          </Col>
        </Row>
        <Row>
          <Col>
          <p className='account__address'><b>Certificate hash:</b> {hash}</p>
          <canvas id="canvas"></canvas>
          </Col>
        </Row>
      </div>
    </Container>
    <button onClick={handleExport}>Export to PDF</button>

    </>
  )
}

export default CertificateTemplate