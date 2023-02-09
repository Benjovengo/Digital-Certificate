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

  const uploadFile = async () => {
    /// Config Pinata API
    var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/data/testAuthentication',
      headers: {
        'Authorization': JWT
      },
    };
  
    const res = await axios(config)
    console.log(res.data)
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

    //DECRYPT
    const decrypted = await decryptData(account, encrypted)

    document.getElementById('publicKeyText').innerHTML = decrypted
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