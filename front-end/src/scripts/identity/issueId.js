import { ethers } from 'ethers';
import { Buffer } from 'buffer';

/** Contract(s) and Address(es) */
import IdentityManager from '../../abis/IdentityManager.json'; // contract ABI
import config from '../../config.json'; // contract addresses

/// Required to create the hash
const web3 = require('web3');



/** Register new product */
export const issueNewId = async (_tokenURI) => {
  /// Get the token URI hash
  const urlSplit = _tokenURI.split('/');
  const hashString = urlSplit[urlSplit.length - 1];
  //const hash = web3.utils.soliditySha3(hashString);

  // Setup provider and network
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const signer = provider.getSigner(); // get the signer

  /// Javascript "version" of the smart contract
  const identityManager = new ethers.Contract(config[network.chainId].identityManager.address, IdentityManager, signer);

  /// Get the public key for the account
  //const publicKey = await getPublicKey()

/// DEBUG - hard coded values like in testing
  const hash = web3.utils.soliditySha3('Identity Hash');
  const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";

  /// Create new Id Token
  await identityManager.createNewId(_tokenURI, publicKey)
  //console.log(await identityManager.debug())

    console.log('\nToken URI:  ', _tokenURI)
    console.log('Hash:       ', hash)
    console.log('Public Key: ', publicKey, '\n\n')
}



/** Retrieve the public key for the logged MetaMask account */
const getPublicKey = async () => {
  /// Get the account address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  /// Key is returned as base64
  const keyB64 = await window.ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account],
  });
  const publicKey = Buffer.from(keyB64, 'base64');

  return publicKey;
}