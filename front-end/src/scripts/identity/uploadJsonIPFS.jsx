import { ethers } from 'ethers';
import { Buffer } from 'buffer';


// Encryption
import { encryptData } from "./cryptography";

// Pinata
import axios from "axios";
const FormData = require('form-data')


  const uploadJSONtoIPFS = async (_firstName, _lastName, _imgURL, _issuedBy, _dateIssued) => {

    let ImgHash

    try {

      const plainData = 'Fabio'

      const formData = new FormData();
      const base64Data = 'aGVsbG8gd29ybGQ='; // "hello world" encoded in base64
      formData.append('file', new Blob([Buffer.from([base64Data], 'base64')], { type: 'application/octet-stream' }), 'hello.dat');

      console.log(formData)



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

      ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      //console.log(response.data.IpfsHash);
      //console.log(ImgHash)


    } catch (error) {
        console.log("File to IPFS: ")
        console.log(error)
    }
  return ImgHash
}

export default uploadJSONtoIPFS




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