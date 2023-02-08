import React, { useEffect, useState } from  'react'
import { Container, Row, Col } from "reactstrap";

import profilePhoto from "../../../assets/images/ProfilePhoto.png"

/// Style
import "./create-id.css"

const CreateId = () => {
  /// React Hooks
  const [fileImg, setFileImg] = useState(null);
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

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

  return (
    <>
      <section className='create__id__wrapper'>
        <Container fluid>
          <Row>

            <Col className='me-3'>
                <Row>
                  <Col>
                    <h1>Your ID</h1>
                  </Col>
                </Row>
                <Row>
                  <div className='preview__id__wrapper'>
                    <Row className='mt-5 ms-2'>
                      <Col>
                        <img src={profilePhoto} className="identity__photo__preview" alt="id" />
                      </Col>
                      <Col xs={7}>
                        <p>First name</p>
                        <p><span id='firstNamePreview'></span></p>
                        <p>Last name</p>
                        <p><span id='lastNamePreview'></span></p>
                        <p>Issued by</p>
                        <p><span id='issuedByPreview'></span></p>
                        <p>Date issued</p>
                        <p><span id='dateIssuedPreview'></span></p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Address</p>
                        <p className='identity__address'>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</p>
                      </Col>
                    </Row>
                  </div>
                </Row>
            </Col>

            <Col xs={8}>
              <h1>Create ID Form</h1>
              <p> <span>Disclaimer!</span><br/> This functionality is only intended for use by trusted issuers and is temporarily available to everyone during the testing phase of the project. Please exercise caution and reserve its usage for its intended purpose only.</p>
              <form>
                <Row>
                  <Col>
                    <label htmlFor="firstName" value={name}>First name:</label><br/>
                    <input type="text" id="firstName" name="firstName" onChange={(e) => changeFirstName(e)} onKeyUp={(e) => changeFirstName(e)} required></input>
                  </Col>
                  <Col>
                    <label htmlFor="lastName">Last name:</label><br/>
                    <input type="text" id="lastName" name="lastName" onChange={(e) => changeLastName(e)} onKeyUp={(e) => changeLastName(e)} required></input>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label htmlFor="issuedBy">Issued by (Country):</label><br/>
                    <input type="text" id="issuedBy" name="issuedBy" onChange={(e) => changeIssuedBy(e)} onKeyUp={(e) => changeIssuedBy(e)} required></input>
                  </Col>
                  <Col>
                    <label htmlFor="issuedDate" id='dateInput'>Issue date:</label><br/>
                    <input id="issueDate" type="date" name="issueDate" defaultValue={today} disabled/> 
                  </Col>
                </Row>
                <Row>
                <input type="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => handleImage(e)} required />
                </Row>
                <Row>
                  <button className='submit__btn submit'>Create ID</button>
                </Row>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default CreateId