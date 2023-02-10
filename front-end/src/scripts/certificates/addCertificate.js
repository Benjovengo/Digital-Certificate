import { ethers } from 'ethers';
import { Buffer } from 'buffer';

//import { getPublicKey } from '../getPublicKey';


/** Contract(s) and Address(es) */
//import IdentityToken from '../../abis/IdentityToken.json'; // contract ABI
import CertificationManager from '../../abis/CertificationManager.json'; // contract ABI
import config from '../../config.json'; // contract addresses

/// Required to create the hash



/** Issue new Id */
export const issueNewCertification = async (_tokenURI, _hash) => {
  // Setup provider and network
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const signer = provider.getSigner(); // get the signer
  /// Javascript "version" of the smart contract
  const certificationManager = new ethers.Contract(config[network.chainId].certificationManager.address, CertificationManager, signer);

  /// Get the account address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])
  /// Get the public key for the account
  const publicKey = await getPublicKey()


  console.log(_hash)
  //SHA256("test")


  /// Create new Id Token
  const certificationURI = "path to the URI";
  const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
  const publicK = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";
  //await certificationManager.createNewCertification(certificationURI, hash, publicK)

  console.log(await certificationManager.DEBUG())

}



/** Retrieve the public key for the logged MetaMask account */
export const getPublicKey = async () => {
  /// Get the account address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  /// Key is returned as base64
  const keyB64 = await window.ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account],
  });

  return keyB64.toString();
}