import { encrypt } from '@metamask/eth-sig-util'
//const ascii85 = require('ascii85');


export const encryptData = (_publicKey, _data) => {
  const enc = encrypt({
    publicKey: _publicKey.toString('base64'),
    data: _data.toString(),
    version: 'x25519-xsalsa20-poly1305',
  });

  return enc
}