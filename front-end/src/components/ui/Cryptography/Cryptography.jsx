import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer';

// Style
import "./cryptography.css"

// Data encryption
import { encryptData, decryptData } from '../../../scripts/identity/cryptography';

// Pinata
import axios from "axios";
const FormData = require('form-data')
const JWT = `Bearer ${process.env.REACT_APP_PINATA_JWT}`

// Ethers
const ethers = require("ethers")


// Main Function
const Cryptography = () => {


  //const fileURL = "https://gateway.pinata.cloud/ipfs/QmY9J871G3YHYS5Zip9LXNnTcaHG59wNNdT9aUun1e3Kdt" // JSON
  const fileURL = "https://gateway.pinata.cloud/ipfs/QmScJbwbWe3SCSfn94LRHDwpLmScqHcNdqavtKZPBPi6YB"


  // Hooks
  const [responseIPFS, setResponseIPFS] = useState('') // data from the IPFS
  const [encPrototype, setEncPrototype] = useState(null)


  /**
   * Perform action when there is a new response from an HTTP request on the IPFS
   */
  useEffect(() => {
    if (responseIPFS!== '') {
      if (encPrototype === null){
        setPrototype()
      } else {
        decryptMessage(responseIPFS)
      }      
    }
  }, [responseIPFS, encPrototype])


  /**
   * Decrypt a message
   * 
   * @param {blob} _encryptedBlob Blob containing the encrypted message
   */
  const decryptMessage = async (_encryptedBlob) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    
    extractBinaryData(_encryptedBlob).then((uint8Array) => {
      // Set the prototype
      Object.setPrototypeOf(uint8Array, encPrototype)
      decryptData(account, uint8Array).then((uint8Data) => {
        // Decrypt the message
        document.getElementById('publicKeyText').innerHTML = uint8Data
      })
    });
  }


  /**
   * Set the prototype for decrypting the message
   */
  const setPrototype = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    // Key is returned as base64
    const keyB64 = await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account],
    });
    const publicKey = Buffer.from(keyB64, 'base64');
    // Encrypt Dummy
    if (encPrototype===null) {
      const data = ""
      const encryptDummy = encryptData(publicKey, data)
      setEncPrototype(Object.getPrototypeOf(encryptDummy))
    }
  }


  /**
   * Download data from a file in Pinata
   * 
   * @param {string} _fileURL The URL of the data in Pinata (IPFS)
   */
  const downloadFile = async (_fileURL) => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = processRequest(req);
    req.responseType = 'blob';
    req.open("GET", _fileURL);
    req.send();
  }


  /**
   * Function handler for the HTTP request
   * 
   * @param {XMLHttpRequest} _requestData HTTP request object
   * 
   * @dev Set the hook for the data retrieved as the response of the HTTP request
   */
  function processRequest(_requestData) {
  return function() {
    // check if successful
    if (_requestData.readyState == 4) {
      var response = _requestData.response
      // set the hook
      setResponseIPFS(response)
    }
  }
}



  const submitEncryptedFile = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])

    // Key is returned as base64
    const keyB64 = await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account],
    });
    const publicKey = Buffer.from(keyB64, 'base64');

    // ENCRYPT
    const data = "Fabio Pereira Benjovengo"
    const encrypted = encryptData(publicKey, data)

    /// INTERMEDIARY OPERATIONS
    const dummyData = ""
    const encryptDummy = encryptData(publicKey, dummyData)

    /// Blob
    const encryptedBlob = new Blob([encrypted], { type: 'application/octet-stream' })

    await sendDataToIPFS(encryptedBlob, "encrypted.dat") // send file to IPFS    

    /// Set Prototype
    const prototype = Object.getPrototypeOf(encryptDummy)

    extractBinaryData(encryptedBlob).then((uint8Array) => {
      Object.setPrototypeOf(uint8Array, prototype)

      decryptData(account, uint8Array).then((uint8Data) => {
        //console.log('Decrypted: ', uint8Data)
        document.getElementById('publicKeyText').innerHTML = uint8Data
      })
    });

  }


function extractBinaryData(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = function() {
      resolve(new Uint8Array(reader.result));
    };
    reader.onerror = reject;
  });
}



const sendDataToIPFS = async (_encryptedContents, _fileName) => {
  try {
    const dataFile = new File([_encryptedContents], _fileName)
    const formData = new FormData()
    formData.append('file', dataFile)

    
    const resFile = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data: formData,
      headers: {
        pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        'Content-Type': 'multipart/form-data'
      }
    })

  } catch (error) {
      console.log("JSON to IPFS: ")
      console.log(error);
  }
}









  const [fileImg, setFileImg] = useState(null);
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")





  const sendJSONtoIPFS = async (ImgHash) => {
    try {
      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          "name": name,
          "description": desc,
          "image": ImgHash
        },
        headers: {
          'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
          'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
        },
      });

      console.log("final ", `ipfs://${resJSON.data.IpfsHash}`)
      const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      //mintNFT(tokenURI, currentAccount)   // pass the winner

    } catch (error) {
        console.log("JSON to IPFS: ")
        console.log(error);
    }
  }








  const sendFileToIPFS = async (e) => {

    e.preventDefault();

    if (fileImg) {
      try {

        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data"
          },
        });

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        //console.log(response.data.IpfsHash);
        console.log(ImgHash)
        sendJSONtoIPFS(ImgHash)


      } catch (error) {
          console.log("File to IPFS: ")
          console.log(error)
      }
    }
  }






















  return (
    <>
      <div className='cryptography__container'>
        <h1>Cryptography</h1>
        <button onClick={() => {submitEncryptedFile()}}>Get Public Key</button>
        <h3 id='publicKeyText'>Public Key</h3>
        <button onClick={() => {downloadFile(fileURL)}}>Use DotEnv</button>

        <form onSubmit={sendFileToIPFS}>
          <input type="file" onChange={(e) => setFileImg(e.target.files[0])} required />
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder='name' required value={name} />
          <input type="text" onChange={(e) => setDesc(e.target.value)} placeholder="desc" required value={desc} />
          <br />
          <button type='submit' >Submit</button>
        </form>

      </div>
    </>
    
  )
}

export default Cryptography