import React from 'react'
import { Buffer } from 'buffer';


import "./cryptography.css"

import { encryptData, decryptData } from '../../../scripts/cryptography';
//import uploadFile from '../../../scripts/pinata-ipfs';
import axios from "axios";

const ethers = require("ethers")

const Cryptography = () => {

  const uploadFile = async () => {

    var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/data/testAuthentication',
      headers: {
        'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
        'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
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
  

  return (
    <>
      <div className='cryptography__container'>
        <h1>Cryptography</h1>
        <button onClick={() => {getPublicKey()}}>Get Public Key</button>
        <h3 id='publicKeyText'>Public Key</h3>
        <button onClick={() => {uploadFile()}}>Use DotEnv</button>
      </div>
    </>
    
  )
}

export default Cryptography