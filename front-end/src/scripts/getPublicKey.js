import { ethers } from 'ethers';
import { Buffer } from 'buffer';

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
  const publicKey = Buffer.from(keyB64, 'base64');

  return publicKey.toString();
}

