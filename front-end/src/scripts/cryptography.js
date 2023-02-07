import { encrypt } from '@metamask/eth-sig-util'


export const decryptData = (_account, _data) => {
  const structuredData = {
    version: 'x25519-xsalsa20-poly1305',
    ephemPublicKey: _data.slice(0, 32).toString('base64'),
    nonce: _data.slice(32, 56).toString('base64'),
    ciphertext: _data.slice(56).toString('base64'),
  };

  return "DEBUG!!"
}




export const encryptData = (_publicKey, _data) => {
  const enc = encrypt({
    publicKey: _publicKey.toString('base64'),
    data: _data.toString(),
    version: 'x25519-xsalsa20-poly1305',
  });

  return enc
}