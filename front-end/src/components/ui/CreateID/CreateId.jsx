import React, { useEffect, useState } from  'react'
import { Container, Row, Col } from "reactstrap";

import profilePhoto from "../../../assets/images/ProfilePhoto.png"

/// Style
import "./create-id.css"

/// Send file to IPFS
import uploadImgToIPFS from '../../../scripts/identity/uploadImgIPFS';
import uploadJSONtoIPFS from '../../../scripts/identity/uploadJsonIPFS';

/// Blockchain integration
import { ethers } from 'ethers';
import { issueNewId } from '../../../scripts/identity/issueId';
import { fetchIdentity } from '../../../scripts/identity/fetchIdentity';


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
  window.onload = async function(e) {
    // Get the logged account address
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])

    document.getElementById('firstNamePreview').innerHTML = 'Fábio'
    document.getElementById('lastNamePreview').innerHTML = 'Benjovengo'
    document.getElementById('issuedByPreview').innerHTML = 'Brazil'
    document.getElementById('dateIssuedPreview').innerHTML = today
    document.getElementById('addressPreview').innerHTML = (account ? account : "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    JsBarcode("#barcode1", (account ? account : "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"))
  }

  // Try to load the identity on loading
  useEffect(() => {
    identityFromBlockchain()
  },[])


  /**
   * Handle browse file.
   * 
   * @dev Validate if file type is image.
   * 
   * @param {event} e opened file
   */
  const handleImage = (e) => {
    const file = e.target.files[0];

    /// Update preview image
    let reader = new FileReader();
    let imgTag = document.getElementById('previewImage');
    imgTag.title = file.name;
    reader.onload = function(e) {
      imgTag.src = e.target.result;
    };
    reader.readAsDataURL(file);

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
   * Load data from the blockchain
   */
  const identityFromBlockchain = async () => {

    let identityData = ''
    try {
      identityData = await fetchIdentity()
    } catch(error) {
      console.log('Error loading ID from the blockchain!')
    }
    //console.log('Identity Data:', identityData)

    if (identityData !== '') {
      // Refresh preview card
      document.getElementById('previewImage').src = identityData.image
      document.getElementById('firstNamePreview').innerHTML = identityData.firstName
      document.getElementById('lastNamePreview').innerHTML = identityData.lastName
      document.getElementById('issuedByPreview').innerHTML = identityData.issuedBy
      document.getElementById('dateIssuedPreview').innerHTML = identityData.dateIssued
      document.getElementById('addressPreview').innerHTML = identityData.address
      JsBarcode("#barcode1", identityData.address)
    } else {
      // Refresh preview card
      document.getElementById('firstNamePreview').innerHTML = 'UNKNOWN'
      document.getElementById('lastNamePreview').innerHTML = 'UNKNOWN'
      document.getElementById('issuedByPreview').innerHTML = 'UNKNOWN'
      document.getElementById('dateIssuedPreview').innerHTML = ''
      document.getElementById('addressPreview').innerHTML = 'ADD AN ID USING THE FORM ON THE RIGHT'
      JsBarcode("#barcode1", '0x0000000000000000000000000000000000000000')
    }
    
  }

  /**
   * Submit Form - handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    /// Uploading...
    console.log('Creating new ID...')


    /// Upload picture
    const pictureUrl = await uploadImgToIPFS(fileImg)
    //document.getElementById('previewImage').src = fileImg.files[0]
    /// Set identity fields
    let givenFirstName = e.target.firstName.value
    let givenLastName = e.target.lastName.value
    let givenIssuedBy = e.target.issuedBy.value
    /// Upload identity data
    const metadataUrl = await uploadJSONtoIPFS(givenFirstName, givenLastName, pictureUrl, givenIssuedBy, today)

    /// Mint NFT ID token
    await issueNewId(metadataUrl)

    /// Uploading completed
    console.log('New ID created.')
    alert('Use the console.logs as placeholders to set an uploading bool to show and hide an overlay to show that the creation of the ID is in progress.')
  }


  /**
   * Render Identity Page
   */
  return (
    <>
      <section className='create__id__wrapper'>
        <Container fluid>
          <Row>

            <Col xs={4} className='id__preview__col'>
                <Row>
                  <Col className='text-center'>
                    <h2 className='main__header'>Your digital ID</h2>
                  </Col>
                </Row>
                <Row>
                  <div className='preview__id__wrapper'>
                    <Row className='mt-5 ms-2'>
                      <Col className='mt-2'>
                        <img id='previewImage' src={profilePhoto} className="identity__photo__preview" alt="id" />
                      </Col>
                      <Col xs={7} className='mt-2'>
                        <p>First name</p>
                        <h6 id='firstNamePreview'> </h6>
                        <p>Last name</p>
                        <h6 id='lastNamePreview'> </h6>
                        <p>Issued by</p>
                        <h6 id='issuedByPreview'> </h6>
                        <p>Date issued</p>
                        <h6 id='dateIssuedPreview'> </h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Address</p>
                        <label id='addressPreview' className='identity__address'></label>
                        <img id="barcode1" className='barcode__img' alt='barcode' />
                      </Col>
                    </Row>
                  </div>
                </Row>
                <Row className='justify-content-center mt-5'>
                  <Col className='text-center'>
                    <button className='submit__btn' onClick={() => {identityFromBlockchain()}} >Load your ID</button>
                  </Col>
                  <Col className='text-center'>
                    <button className='submit__btn'>View more info</button>
                    <p><i>not implemented yet</i></p>
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
                      <input type="text" id="firstName" name="firstName" maxLength="50" onChange={(e) => changeFirstName(e)} onKeyUp={(e) => changeFirstName(e)} required></input>
                    </Col>
                    <Col>
                      <label htmlFor="lastName">Last name:</label><br/>
                      <input type="text" id="lastName" name="lastName" maxLength="50" onChange={(e) => changeLastName(e)} onKeyUp={(e) => changeLastName(e)} required></input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label htmlFor="issuedBy">Issued by (Country):</label><br/>
                      <input type="text" id="issuedBy" name="issuedBy" maxLength="50" onChange={(e) => changeIssuedBy(e)} onKeyUp={(e) => changeIssuedBy(e)} required></input>
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
                    <button className='submit__btn submit'>Create/Update ID</button>
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