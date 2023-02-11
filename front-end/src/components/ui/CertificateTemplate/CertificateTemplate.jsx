import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col } from "reactstrap";
import html2pdf from 'html2pdf.js'

import './certificate-template.css'

/// QR code generation
var QRCode = require('qrcode')


const CertificateTemplate = ({ institution, fullName, blockchainAddress, degree, area, advisor, certificateId, hash }) => {


  useEffect(() => {
    var canvas = document.getElementById('canvas')

    QRCode.toCanvas(canvas, hash, function (error) {
      if (error) console.error(error)
      console.log('success!');
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
          <Col>
            <h1>{institution}</h1>
            <h2>{fullName}</h2>
            <p>{blockchainAddress}</p>
            <h2>{degree}</h2>
            <h2>{area}</h2>
            <h3>{advisor}</h3>
            <h2>Serial number: {certificateId}</h2>
            <p>Hash: {hash}</p>
          </Col>
        </Row>
        <Row>
          <Col>
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