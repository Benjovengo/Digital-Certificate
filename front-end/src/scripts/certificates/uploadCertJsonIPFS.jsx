// Pinata
import axios from 'axios'

async function getSHA256 (_message) {
  const encoder = new TextEncoder()
  const data = encoder.encode(_message)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return hash
}

const uploadCertificationJSONtoIPFS = async (_institution, _blockchainAddress, _workTitle, _advisor, _coAdvisor, _degree, _gpa, _date) => {
  let tokenURI
  const plainData = {
    institution: _institution,
    blockchainAddress: _blockchainAddress,
    workTitle: _workTitle,
    advisor: _advisor,
    coAdvisor: _coAdvisor,
    degree: _degree,
    gpa: _gpa,
    date: _date
  }

  const hash = await getSHA256(_institution + _blockchainAddress + _workTitle + _advisor + _coAdvisor + _degree + _gpa + _date)

  try {
    const resJSON = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinJsonToIPFS',
      data: plainData,
      headers: {
        pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`
      }
    })

    tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`
    // console.log("Token URI", tokenURI);
    // mintNFT(tokenURI, currentAccount)   // pass the winner
  } catch (error) {
    console.log('JSON to IPFS: ')
    console.log(error)
  }

  return { tokenURI, hash }
}

export default uploadCertificationJSONtoIPFS
