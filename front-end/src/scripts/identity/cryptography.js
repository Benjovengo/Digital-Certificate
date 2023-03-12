import { Buffer } from 'buffer'
import { encrypt } from '@metamask/eth-sig-util'
import { ethers } from 'ethers';

/**
 * Decrypt message
 *
 * @param {string} _account Account logged in MetaMask
 * @param {bytes64} _data Encrypted data
 * @returns {string} Decrypted message
 */
export const decryptData = async (_account, _data) => {
  try {
    // Send request to MetaMask to decrypt the cyphered text
    // The application must have access to the account
    const decrypt = await window.ethereum.request({
      method: 'eth_decrypt',
      params: [_data, _account]
    })
    return decrypt
  } catch (error) {
    return error.message
  }
}



/**
 * 
 * @param {bytes} value Encrypted data using MetaMask public key
 * @returns Hex representation of the encrypted message
 */
function stringifiableToHex(value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}


/**
 * Encrypt data
 *
 * @param {bytes64} _publicKey Public key associated with the logged MetaMask account
 * @param {string} _data Data to be encrypted
 * @returns {bytes64} Encrypted data
 */
export const encryptData = (_publicKey, _data) => {
  const enc = encrypt({
    publicKey: _publicKey.toString('base64'),
    data: _data.toString(),
    version: 'x25519-xsalsa20-poly1305'
  })

  return stringifiableToHex(enc)
}
