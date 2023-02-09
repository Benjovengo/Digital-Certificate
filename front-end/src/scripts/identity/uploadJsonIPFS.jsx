// Pinata
import axios from "axios";
//const FormData = require('form-data')

import { encryptData } from "./cryptography";

import { Buffer } from 'buffer';
// Ethers.js
const ethers = require("ethers")

const getPublicKey = async () => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  // Key is returned as base64
  const keyB64 = await window.ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account],
  });
  const publicKey = Buffer.from(keyB64, 'base64');

  return publicKey
}

const uploadJSONtoIPFS = async (_firstName, _lastName, _imgURL, _issuedBy, _dateIssued) => {
  let tokenURI
  const plainData = {
    "firstName": _firstName,
    "lastName": _lastName,
    "image": _imgURL,
    "issuedBy": _issuedBy,
    "dateIssued": _dateIssued
  }
  const plainDataDebug = `${_firstName}, ${_lastName}`
  /// Encrypt identity data
  const encryptedData = encryptData(await getPublicKey(), plainDataDebug)
  
  try {
    const resJSON = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
      data: {encryptedData},
      headers: {
        'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
        'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
      },
    });

    tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
    //console.log("Token URI", tokenURI);
    //mintNFT(tokenURI, currentAccount)   // pass the winner

  } catch (error) {
      console.log("JSON to IPFS: ")
      console.log(error);
  }
  return tokenURI
}

export default uploadJSONtoIPFS