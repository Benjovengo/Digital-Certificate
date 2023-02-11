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
            <p>The Board of trustees of {institution}, upon recommendation of the faculty, in particular professor {advisor} (advisor), has conferred upon</p>
            <h2>{fullName}</h2>
            <p><span>{blockchainAddress}</span></p>
            <p>the degree of</p>
            <h2>{degree}</h2>
            <p>in</p>
            <h2>{area}</h2>
            <p>With all the rights, honors, and privileges thereunto appertaining. In witness whereof, the seal of the University and the signatures as authorizes by the Board of Trustees, {institution}, are hereunto affixed, this <b>date</b>.</p>
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