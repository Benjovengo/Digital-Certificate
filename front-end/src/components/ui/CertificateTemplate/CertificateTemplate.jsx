import React, { useEffect } from 'react'
import { Container, Row, Col } from "reactstrap";
import html2pdf from 'html2pdf.js'


import './certificate-template.css'
import universityBadge from '../../../assets/images/university_badge_signed.png'

/// QR code generation
var QRCode = require('qrcode')


const CertificateTemplate = ({ institution, fullName, blockchainAddress, degree, area, advisor, certificateId, hash, date, txHash }) => {


  useEffect(() => {
    // Certification Hash QR Code
    var canvas = document.getElementById('canvas')
    QRCode.toCanvas(canvas, hash, function (error) {
      if (error) console.error(error)
    })

    // Certification Hash QR Code
    var canvasEtherscan = document.getElementById('canvasEtherscan')
    QRCode.toCanvas(canvasEtherscan, `https://goerli.etherscan.io/tx/${txHash}`, function (error) {
      if (error) console.error(error)
    })

    // Highlight uppercase letters
    const text = document.getElementById("institution__header");
    const words = text.innerText.split(" ");
    let highlightedText = "";

    for (let i = 0; i < words.length; i++) {
      if (words[i] === words[i].toUpperCase()) {
        highlightedText += `<span class="highlighted">${words[i] + " "}</span>`;
      } else {
        if (words[i][0] === words[i][0].toUpperCase()) {
          highlightedText += `<span class="highlighted">${words[i][0]}</span>${words[i].slice(1)} `;
        } else {
          highlightedText += words[i] + " ";
        }
      }
    }

    text.innerHTML = highlightedText;
  }, [hash, txHash])

  /**
   * Export certificate to pdf
   */
  function handleExport() {
    // Choose the element id which you want to export.
    var element = document.getElementById('divToExport');
    /* element.style.width = '990px';
    element.style.height = '770px'; */
    const divHeightPx = element.style.height
    const divHeight = Number(divHeightPx.slice(0,-2))
    var opt = {
        filename:     `Certificate_${fullName.replace(/\s+/g, '')}.pdf`,
        html2canvas:  { height: divHeight },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
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
                <h1 id="institution__header">{institution}</h1>
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
      </div>

      <div className='export__to__pdf'>
        <Row>
          <Col>
            <button onClick={handleExport}>Export certificate to PDF</button>
          </Col>
        </Row> 
      </div>
      

      <div className='metadata__wrapper'>
        <Row>
          <Col className='d-flex justify-content-center'>
            <h3>Certificate Metadata</h3>
          </Col>
        </Row>
         <Row>
          <Col>
            <p><b>Certificate Serial Number:</b> <span>{certificateId}</span></p>
            <p><b>Certificate hash:</b> <span>{hash}</span></p>
            <h5><br/>Check minting transaction on Etherscan</h5>
            <p><a href={`https://goerli.etherscan.io/tx/${txHash}`}>{`https://goerli.etherscan.io/tx/${txHash}`}</a></p>
          </Col>
        </Row>
        <div className='qr__code__wrapper'>
          <Row className='justify-content-center mt-5'>
            <Col className='text-center'>
              <h5>Address on Etherscan</h5>
              <canvas id="canvasEtherscan"></canvas>
            </Col>
            <Col className='text-center'>
              <h5>Certificate Hash</h5>
              <canvas id="canvas"></canvas>
            </Col>
          </Row>
        </div>
        
      </div>
    </Container>
    

    </>
  )
}

export default CertificateTemplate