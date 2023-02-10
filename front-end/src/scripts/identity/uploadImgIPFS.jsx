// import React, { useState } from 'react'
// import { Buffer } from 'buffer';

// Pinata
import axios from 'axios'
const FormData = require('form-data')
// const JWT = `Bearer ${process.env.REACT_APP_PINATA_JWT}`

const uploadImgToIPFS = async (_fileImg) => {
  let ImgHash

  if (_fileImg) {
    try {
      const formData = new FormData()
      formData.append('file', _fileImg)

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

      ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`
      // console.log(response.data.IpfsHash);
      // console.log(ImgHash)
    } catch (error) {
      console.log('File to IPFS: ')
      console.log(error)
    }
  }
  return ImgHash
}

export default uploadImgToIPFS
