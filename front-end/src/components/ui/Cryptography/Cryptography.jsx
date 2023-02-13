import React, { useState } from 'react'
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

  const req = new XMLHttpRequest();

  const uploadFile = async () => {
    /// Config Pinata API
    /* var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/data/testAuthentication',
      headers: {
        'Authorization': JWT
      },
    };
  
    const res = await axios(config)
    console.log(res.data) */

    
    //req.addEventListener("load", reqListener);
    req.onreadystatechange = processRequest;
    req.open("GET", "https://gateway.pinata.cloud/ipfs/QmY9J871G3YHYS5Zip9LXNnTcaHG59wNNdT9aUun1e3Kdt");
    req.send();

  }


  function processRequest()
{
  if (req.readyState == 4) {
    var resp = req.responseText // JSON.parse(req.responseText);

    console.log(req)

    // resp now has the text and you can process it.
    console.log('Download: ', resp);
  }
}



  const getPublicKey = async () => {
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

    /// Set Prototype
    let prototype = Object.getPrototypeOf(encryptDummy)
    const encryptedBlob = new Blob([encrypted], { type: 'application/octet-stream' })

    await sendDataToIPFS(encryptedBlob) // send file to IPFS

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



const sendDataToIPFS = async (_encryptedContents) => {
  try {
    const dataFile = new File([_encryptedContents], "encrypted.dat")
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

    console.log(resFile)

    console.log("final ", `ipfs://${resFile.data.IpfsHash}`)
    //mintNFT(tokenURI, currentAccount)   // pass the winner

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
        <button onClick={() => {getPublicKey()}}>Get Public Key</button>
        <h3 id='publicKeyText'>Public Key</h3>
        <button onClick={() => {uploadFile()}}>Use DotEnv</button>

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