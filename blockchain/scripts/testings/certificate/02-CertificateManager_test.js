const { expect } = require('chai')
const { ethers } = require('hardhat')

const certificateManagerTesting = async () => {
  describe('Certificate Manager', () => {
    /// Accounts
    let deployer, account01, account02
    /// Contracts
    let certificateToken
    let certificateManager

    beforeEach(async () => {
      // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
      [deployer, account01, account02] = await ethers.getSigners()

      // Deploy certificate NFT token
      const CertificateToken = await ethers.getContractFactory('CertificateToken')
      certificateToken = await CertificateToken.connect(deployer).deploy()

      // Deploy certificate manager
      const CertificateManager = await ethers.getContractFactory('CertificateManager')
      certificateManager = await CertificateManager.deploy(certificateToken.address)

      // Only the CertificateManager can call CertificateToken functions - must be the owner of the token contract
      await certificateToken.transferOwnership(certificateManager.address)
    })

    it('Deployment address.', async () => {
      const result = await certificateManager.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })

    it('Issue new certificate - mint NFT token.', async () => {
      // hard-coded setup for minting
      const blockchainAddress = account01.address
      const level = 1
      const gpa = 388
      const certificateURI = 'path to the URI'
      const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      const publicKey = '0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429'

      await certificateManager.connect(account01).createNewCertificate(blockchainAddress, level, gpa, certificateURI, hash, publicKey)
      // get the owner of the certificate/token
      const result = await certificateToken.ownerOf(1)
      expect(result).to.equal(account01.address)
    })

    it('Get the number of certificates for an account.', async () => {
      // hard-coded setup for minting
      const blockchainAddress = account01.address
      const level = 1
      const gpa = 388
      const certificateURI = 'path to the URI'
      const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      const publicKey = '0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429'
      const certificatesLength = 1 // number of certificates
      // create certificates
      for (let i = 0; i < certificatesLength; i++) {
        await certificateManager.connect(account01).createNewCertificate(blockchainAddress, level, gpa, certificateURI, hash, publicKey)
      }
      // get the number of certificates
      const result = await certificateManager.getNumberOfCertificates(blockchainAddress)
      expect(result).to.equal(certificatesLength)
    })

    it('Get the number of addresses with one or more certificates.', async () => {
      // hard-coded setup for minting
      const blockchainAddresses = [account01.address, account02.address, account01.address]
      const level = 1
      const gpa = 388
      const certificateURI = 'path to the URI'
      const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      const publicKey = '0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429'

      for (let i = 0; i < blockchainAddresses.length; i++) {
        await certificateManager.createNewCertificate(blockchainAddresses[i], level, gpa, certificateURI, hash, publicKey)
      }
      // get the owner of unique addresses
      const result = await certificateManager.getNumberOfAddresses()
      expect(result).to.equal(2)
    })

    it('Get the public key associated with an account.', async () => {
      // hard-coded setup for minting
      const blockchainAddresses = [account01.address, account01.address, account02.address]
      const level = 1
      const gpa = 388
      const certificateURI = 'path to the URI'
      const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      const publicKey = ['0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429', '0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429', '0xEB17A4262d3dc9B924c429C74a9a98Af6108adD8']

      for (let i = 0; i < blockchainAddresses.length; i++) {
        await certificateManager.createNewCertificate(blockchainAddresses[i], level, gpa, certificateURI, hash, publicKey[i])
      }
      // get the owner of unique addresses
      const result01 = await certificateManager.getPublicKey(account01.address)
      const result01Str = String(result01)
      const result02 = await certificateManager.getPublicKey(account02.address)
      const result02Str = String(result02)
      expect(result01Str.toUpperCase()).to.equal('0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429'.toUpperCase())
      expect(result02Str.toUpperCase()).to.equal('0xEB17A4262d3dc9B924c429C74a9a98Af6108adD8'.toUpperCase())
    })
  })
}

module.exports = certificateManagerTesting
