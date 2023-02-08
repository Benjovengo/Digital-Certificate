// Pinata
import axios from "axios";
const FormData = require('form-data')

const uploadJSONtoIPFS = async (_firstName, _lastName, _imgURL, _issuedBy, _dateIssued) => {
  let tokenURI
  try {
    const resJSON = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
      data: {
        "name": 'Test',
        "firstName": _firstName,
        "lastName": _lastName,
        "image": _imgURL,
        "issuedBy": _issuedBy,
        "dateIssued": _dateIssued
      },
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