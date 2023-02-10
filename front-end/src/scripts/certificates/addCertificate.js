import { ethers } from 'ethers';

/** Contract(s) and Address(es) */
//import IdentityToken from '../../abis/IdentityToken.json'; // contract ABI
import CertificationManager from '../../abis/CertificationManager.json'; // contract ABI
import config from '../../config.json'; // contract addresses


/** Issue new Id */
export const issueNewCertification = async (_tokenURI, _hash) => {
  // Setup provider and network
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const signer = provider.getSigner(); // get the signer
  /// Javascript "version" of the smart contract
  const certificationManager = new ethers.Contract(config[network.chainId].certificationManager.address, CertificationManager, signer);

  /// Get the public key for the account
  const publicKey = await getPublicKey()

  /// Create new Id Token
  const newHash = buf2hex(_hash).substring(0, 66);
  await certificationManager.createNewCertification(_tokenURI, newHash, publicKey)

}

/** Convert from ArrayBuffer to string */
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return '0x' + [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
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