import { ethers } from 'ethers';

/** Contract(s) and Address(es) */
import IdentityToken from '../../abis/IdentityToken.json'; // contract ABI
import IdentityManager from '../../abis/IdentityManager.json'; // contract ABI
import config from '../../config.json'; // contract addresses


/** Fetch identity data for the logged blockchain address 
 * 
 * 
*/
export const fetchIdentity = async () => {
  // Setup provider and network
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const signer = provider.getSigner(); // get the signer

  /// Javascript "version" of the smart contract
  const identityToken = new ethers.Contract(config[network.chainId].identityToken.address, IdentityToken, signer);
  const identityManager = new ethers.Contract(config[network.chainId].identityManager.address, IdentityManager, signer);

  // Get the logged account address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])
  
  /// Create new Id Token
  const serialNumber = Number(await identityToken.getSerialNumber(account))

  /// Get Token URI
  const uri = await identityToken.tokenURI(serialNumber)

  /// Fetch Identity Info
  const response = await fetch(uri)
  const identityJSON = await response.json()
  identityJSON['address'] = account

  /// DEBUG logs
  // console.log('Token Serial Number: ', serialNumber)
  // console.log('Token URI: ', uri)
  // console.log(identityJSON)

  return identityJSON
}
