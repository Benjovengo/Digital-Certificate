import { ethers } from 'ethers'

/** Contract(s) and Address(es) */
import IdentityToken from '../../abis/IdentityToken.json' // contract ABI
import config from '../../config.json' // contract addresses

/** Fetch identity data for the logged blockchain address
 *
 *
*/
export const fetchIdentity = async () => {
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer

  /// Javascript "version" of the smart contract
  const identityToken = new ethers.Contract(config[network.chainId].identityToken.address, IdentityToken, signer)

  // Get the logged account address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  /// Test if the address has an issued identity associated with it
  let identityJSON
  /// Create new Id Token
  const serialNumber = Number(await identityToken.getSerialNumber(account))

  if (serialNumber !== 0) {
    /// Get Token URI
    const uri = await identityToken.tokenURI(serialNumber)

    /// Fetch Identity Info
    const response = await fetch(uri)
    identityJSON = await response.json()
    identityJSON.address = account
  } else {
    identityJSON = ''
  }

  /// DEBUG logs
  // console.log('Token Serial Number: ', serialNumber)
  // console.log('Token URI: ', uri)
  // console.log(identityJSON)

  return identityJSON
}
