import { ethers } from 'ethers'

/** Contract(s) and Address(es) */
import CertificateToken from '../../abis/CertificateToken.json' // contract ABI
import CertificateManager from '../../abis/CertificateManager.json' // contract ABI
import config from '../../config.json' // contract addresses

/** Issue new Id */
export const issueNewCertificate = async (_blockchainAddress, _level, _gpa, _tokenURI, _hash) => {
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer
  /// Javascript "version" of the smart contract
  const certificateToken = new ethers.Contract(config[network.chainId].certificateToken.address, CertificateToken, signer)
  const certificateManager = new ethers.Contract(config[network.chainId].certificateManager.address, CertificateManager, signer)

  /// Get the public key for the account
  const publicKey = await getPublicKey()

  /// Get the number of certificates of an address
  const listOfCertificates = await certificateToken.listCertificates(_blockchainAddress)
  const total = listOfCertificates.length

  /// Create new Id Token
  const newHash = buf2hex(_hash).substring(0, 66)
  const createTx = await certificateManager.createNewCertificate(_blockchainAddress, parseInt(_level), _gpa*100, _tokenURI, newHash, ethers.utils.toUtf8Bytes(publicKey))

  // Store the hash
  certificateManager.setHash(total, createTx.hash)
}

/** Convert from ArrayBuffer to string */
function buf2hex (buffer) { // buffer is an ArrayBuffer
  return '0x' + [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

/** Retrieve the public key for the logged MetaMask account */
export const getPublicKey = async () => {
  /// Get the account address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  /// Key is returned as base64
  const keyB64 = await window.ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account]
  })

  return keyB64.toString()
}
