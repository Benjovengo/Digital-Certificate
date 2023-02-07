import React from 'react'
import { Buffer } from 'buffer';


import "./cryptography.css"

import { encryptData, decryptData } from '../../../scripts/cryptography';


const ethers = require("ethers")

const Cryptography = () => {

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
      </div>
    </>
    
  )
}

export default Cryptography