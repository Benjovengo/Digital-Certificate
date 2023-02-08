import React, { useEffect, useState } from  'react'
import { Container, Row, Col } from "reactstrap";

import profilePhoto from "../../../assets/images/ProfilePhoto.png"

/// Style
import "./create-id.css"

/// Send file to IPFS
import uploadImgToIPFS from '../../../scripts/identity/uploadImgIPFS';
import uploadJSONtoIPFS from '../../../scripts/identity/uploadJsonIPFS';

/// Barcode
const JsBarcode = require("jsbarcode");

const CreateId = () => {
  /// React Hooks
  const [fileImg, setFileImg] = useState(null);
  //const [name, setName] = useState("")
  //const [desc, setDesc] = useState("")

  /// Set today's date
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  var today = currentDate.toISOString().substring(0,10);

  /// Set default values for preview
  window.onload = function(e) {
    document.getElementById('firstNamePreview').innerHTML = 'Fábio'
    document.getElementById('lastNamePreview').innerHTML = 'Benjovengo'
    document.getElementById('issuedByPreview').innerHTML = 'Brazil'
    document.getElementById('dateIssuedPreview').innerHTML = today
    JsBarcode("#barcode1", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
  }



  /**
   * Handle browse file.
   * 
   * @dev Validate if file type is image.
   * 
   * @param {event} e opened file
   */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setFileImg(file);
    } else {
      setFileImg(null);
      alert("Invalid file type. Please select an image file.");
    }
  }

  /**
   * Handle first name input changes.
   * 
   * @param {event} e Change preview label.
   */
  const changeFirstName = (e) => {
    if (e.target.value) {
      document.getElementById('firstNamePreview').innerHTML = e.target.value
    } 
    else {
      document.getElementById('firstNamePreview').innerHTML = 'John'
    }
  };

  /**
   * Handle last name input changes.
   * 
   * @param {event} e Change preview label.
   */
  const changeLastName = (e) => {
    if (e.target.value) {
      document.getElementById('lastNamePreview').innerHTML = e.target.value
    } 
    else {
      document.getElementById('lastNamePreview').innerHTML = 'Doe'
    }
  };

  /**
   * Handle issued by input changes.
   * 
   * @param {event} e Change preview label.
   */
  const changeIssuedBy = (e) => {
    if (e.target.value) {
      document.getElementById('issuedByPreview').innerHTML = e.target.value
    } 
    else {
      document.getElementById('issuedByPreview').innerHTML = 'Brazil'
    }
  };

  /**
   * Submit Form - handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    /// Upload picture
    const pictureUrl = await uploadImgToIPFS(fileImg)
    
    ///_firstName, _lastName, _imgURL, _issuedBy, _dateIssued
    let givenFirstName = e.target.firstName.value
    let givenLastName = e.target.lastName.value
    let givenIssuedBy = e.target.issuedBy.value

    /// Upload identity data
    const metadataUrl = await uploadJSONtoIPFS(givenFirstName, givenLastName, pictureUrl, givenIssuedBy, today)
    alert('Uploaded to: ' + metadataUrl)
  }


  /**
   * Render Identity Page
   */
  return (
    <>
      <section className='create__id__wrapper'>
        <Container fluid>
          <Row>

            <Col>
                <Row>
                  <Col className='text-center'>
                    <h2 className='main__header'>Your digital ID</h2>
                  </Col>
                </Row>
                <Row>
                  <div className='preview__id__wrapper'>
                    <Row className='mt-5 ms-2'>
                      <Col className='mt-2'>
                        <img src={profilePhoto} className="identity__photo__preview" alt="id" />
                      </Col>
                      <Col xs={7} className='mt-2'>
                        <p>First name</p>
                        <h6 id='firstNamePreview'></h6>
                        <p>Last name</p>
                        <h6 id='lastNamePreview'></h6>
                        <p>Issued by</p>
                        <h6 id='issuedByPreview'></h6>
                        <p>Date issued</p>
                        <h6 id='dateIssuedPreview'></h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Address</p>
                        <label className='identity__address'>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</label>
                        <img id="barcode1" className='barcode__img' />
                      </Col>
                    </Row>
                  </div>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-center mt-4">
                    <button className='submit__btn'>Load your ID</button>
                  </Col>
                  <Col className="d-flex justify-content-center mt-4">
                    <button className='submit__btn'>View more info</button>
                  </Col>
                </Row>
            </Col>

            <Col xs={8}>
              <div className="form__column__wrapper">
                <h2 className='main__header'>Create ID Form</h2>
                <form className='input__form' onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <label htmlFor="firstName">First name:</label><br/>
                      <input type="text" id="firstName" name="firstName" maxLength="30" onChange={(e) => changeFirstName(e)} onKeyUp={(e) => changeFirstName(e)} required></input>
                    </Col>
                    <Col>
                      <label htmlFor="lastName">Last name:</label><br/>
                      <input type="text" id="lastName" name="lastName" maxLength="30" onChange={(e) => changeLastName(e)} onKeyUp={(e) => changeLastName(e)} required></input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="issuedBy">Issued by (Country):</label><br/>
                      <input type="text" id="issuedBy" name="issuedBy" maxLength="30" onChange={(e) => changeIssuedBy(e)} onKeyUp={(e) => changeIssuedBy(e)} required></input>
                    </Col>
                    <Col>
                      <label htmlFor="issuedDate" id='dateInput'>Issue date:</label><br/>
                      <input id="issueDate" type="date" name="issueDate" defaultValue={today} disabled/> 
                    </Col>
                  </Row>
                  <Row>
                  <input type="file" id='imageFile' accept="image/png, image/gif, image/jpeg" onChange={(e) => handleImage(e)} required />
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-end">
                    <button className='submit__btn submit'>Create ID</button>
                    </Col>
                  </Row>
                </form>
                <h3>Your data will be encrypted before being uploaded to IPFS!</h3>
                <p>This includes not only the text fields, but also your <span className='highlight__text'>picture will be encrypted</span> to ensure complete privacy.</p>
                <p><b>Disclaimer!</b><br/> This functionality is only intended for use by trusted issuers and is temporarily available to everyone during the testing phase of the project. Please exercise caution and reserve its usage for its intended purpose only.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default CreateId