import React, { useEffect, useState } from  'react'
import { Container, Row, Col } from "reactstrap";

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
  document.getElementById('firstNamePreview').innerHTML = 'John'



  /**
   * Handle browse file
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
   * 
   * @param {event} e Change preview label
   */
  const changeFirstName = (e) => {
    if (e.target.value) {
      document.getElementById('firstNamePreview').innerHTML = e.target.value
    } 
    else {
      document.getElementById('firstNamePreview').innerHTML = 'John'
    }
  };

  return (
    <>
      <section className='create__id__wrapper'>
        <Container>
          <Row>
            <Col>
              <h1>Your ID</h1>
              <p>First name</p>
              <p><span id='firstNamePreview'></span></p>
            </Col>
            <Col xs={8}>
              <h1>Create ID Form</h1>
              <p> <span>Disclaimer:</span> this function must be reserved for trusted issuers. It is enabled to anyone just during the testing phase of the project!</p>
              <form>
                <Row>
                  <Col>
                    <label htmlFor="firstName" value={name}>First name:</label><br/>
                    <input type="text" id="firstName" name="firstName" onChange={(e) => changeFirstName(e)} onKeyUp={(e) => changeFirstName(e)} required></input>
                  </Col>
                  <Col>
                    <label htmlFor="lastName">Last name:</label><br/>
                    <input type="text" id="lastName" name="lastName" required></input>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label htmlFor="issuedBy">Issued by:</label><br/>
                    <input type="text" id="issuedBy" name="issuedBy"></input>
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
                  <button className='submit'>Create ID</button>
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