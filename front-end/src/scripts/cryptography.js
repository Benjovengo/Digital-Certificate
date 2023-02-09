import { Buffer } from 'buffer';
import { encrypt } from '@metamask/eth-sig-util'


/**
 * Decrypt message
 * 
 * @param {string} _account Account logged in MetaMask
 * @param {bytes64} _data Encrypted data
 * @returns {string} Decrypted message
 */

export const decryptData = async (_account, _data) => {
  const structuredData = {
    version: 'x25519-xsalsa20-poly1305',
    ephemPublicKey: _data.slice(0, 32).toString('base64'),
    nonce: _data.slice(32, 56).toString('base64'),
    ciphertext: _data.slice(56).toString('base64'),
  };

  // Convert data to hex string required by MetaMask
  const ct = `0x${Buffer.from(JSON.stringify(structuredData), 'utf8').toString('hex')}`;

  // Send request to MetaMask to decrypt the cyphered text
  // Once again application must have access to the account
  const decrypt = await window.ethereum.request({
    method: 'eth_decrypt',
    params: [ct, _account],
  });

  return decrypt
}



/**
 * Encrypt data
 * 
 * @param {bytes64} _publicKey Public key associated with the logged MetaMask account
 * @param {bytes64} _data Data to be encrypted
 * @returns {bytes64} Encrypted data
 */
export const encryptData = (_publicKey, _data) => {
  const enc = encrypt({
    publicKey: _publicKey.toString('base64'),
    data: _data.toString(),
    version: 'x25519-xsalsa20-poly1305',
  });

  const buf = Buffer.concat([
    Buffer.from(enc.ephemPublicKey, 'base64'),
    Buffer.from(enc.nonce, 'base64'),
    Buffer.from(enc.ciphertext, 'base64'),
  ]);

  
  return buf
}