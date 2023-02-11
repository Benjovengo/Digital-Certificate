import { ethers } from 'ethers'

/** Contract(s) and Address(es) */
import CertificateToken from '../../abis/CertificateToken.json' // contract ABI
import config from '../../config.json' // contract addresses

/** Fetch certificate data for the logged blockchain address
 *
 *
*/
export const fetchCertificate = async () => {
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer

  /// Javascript "version" of the smart contract
  const certificateToken = new ethers.Contract(config[network.chainId].certificateToken.address, CertificateToken, signer)

  // Get the logged account address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  /// Test if the address has an issued certificate associated with it
  let certificateJSON
  /// Create new Id Token
  const listOfCertificates = Number(await certificateToken.listCertificates(account))
  console.log('Certificates: ', listOfCertificates)

/*   if (serialNumber !== 0) {
    /// Get Token URI
    const uri = await certificateToken.tokenURI(serialNumber)

    /// Fetch Certificate Info
    const response = await fetch(uri)
    certificateJSON = await response.json()
    certificateJSON.address = account
  } else {
    certificateJSON = ''
  } */

  /// DEBUG logs
  // console.log('Token Serial Number: ', serialNumber)
  // console.log('Token URI: ', uri)
  // console.log(certificateJSON)

  return certificateJSON
}
