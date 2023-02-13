import axios from 'axios'
import { Buffer } from 'buffer';

import { encryptData } from './cryptography'

// Ethers
const ethers = require("ethers")


const uploadJSONtoIPFS = async (_firstName, _lastName, _imgURL, _issuedBy, _dateIssued) => {
  let tokenURI
  const plainData = {
    firstName: _firstName,
    lastName: _lastName,
    image: _imgURL,
    issuedBy: _issuedBy,
    dateIssued: _dateIssued
  }
  try {

    tokenURI = await submitEncryptedFile(plainData)
    console.log("Token URI", tokenURI);
    // mintNFT(tokenURI, currentAccount)   // pass the winner
  } catch (error) {
    console.log('JSON to IPFS: ')
    console.log(error)
  }
  return tokenURI
}

export default uploadJSONtoIPFS




const submitEncryptedFile = async (_data) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  // Get the Public Key from MetaMask
  const keyB64 = await window.ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account],
  });
  const publicKey = Buffer.from(keyB64, 'base64'); // Key is returned as base64

  // Encrypt data
  const encrypted = encryptData(publicKey, _data)
  /// Blob
  const encryptedBlob = new Blob([encrypted], { type: 'application/octet-stream' })

  return await submitDataToIPFS(encryptedBlob, "encrypted.dat") // send file to IPFS
}


const submitDataToIPFS = async (_encryptedContents, _fileName) => {
  let tokenURI = ''
  try {
    const dataFile = new File([_encryptedContents], _fileName)
    const formData = new FormData()
    formData.append('file', dataFile)

    
    const submitResponse = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data: formData,
      headers: {
        pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    tokenURI = `https://gateway.pinata.cloud/ipfs/${submitResponse.data.IpfsHash}`

  } catch (error) {
      console.log("JSON to IPFS: ")
      console.log(error);
  }

  return tokenURI
}