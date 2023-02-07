import React from 'react'
import { Buffer } from 'buffer';


import "./cryptography.css"

import { encryptData } from '../../../scripts/cryptography';


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

    const data = "Fabio Pereira Benjovengo"
    const encrypted = encryptData(publicKey, data)

    const buf = Buffer.concat([
      Buffer.from(encrypted.ephemPublicKey, 'base64'),
      Buffer.from(encrypted.nonce, 'base64'),
      Buffer.from(encrypted.ciphertext, 'base64'),
    ]);

    const bufNumber = buf.toJSON().data

    document.getElementById('publicKeyText').innerHTML = bufNumber

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