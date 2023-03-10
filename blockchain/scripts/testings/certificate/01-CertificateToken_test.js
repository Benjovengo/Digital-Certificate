const { expect } = require('chai')
const { ethers } = require('hardhat')

const certificateTokenTesting = async () => {
  describe('Certificate ERC-721 Token', () => {
    let deployer, account01, account02, certificateManager
    let certificateToken

    beforeEach(async () => {
      // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
      [deployer, account01, account02, certificateManager] = await ethers.getSigners()

      // Deploy CertificateToken
      const CertificateToken = await ethers.getContractFactory('CertificateToken')
      certificateToken = await CertificateToken.connect(deployer).deploy()
    })

    it('Deployment address.', async () => {
      const result = await certificateToken.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })

    it('Mint certificate token.', async () => {
      // hard-coded setup for minting
      const blockchainAddress = account01.address
      const certificateURI = 'path to the URI'
      const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'

      // minting transaction
      await certificateToken.mint(blockchainAddress, certificateURI, hash)
      // get the owner of the identity/token
      const result = await certificateToken.ownerOf(1)
      expect(result).to.equal(account01.address)
    })

    it('Transfer the ownership of the CertificateToken contract.', async () => {
      // Only the IdentityManager can call certain functions - owner of the token contract
      await certificateToken.transferOwnership(certificateManager.address)
      const result = await certificateToken.owner()
      expect(result).to.equal(certificateManager.address)
    })

    it('Prevent transfers', async () => {
      // hard-coded setup for minting
      const blockchainAddress = account01.address
      const certificateURI = 'path to the URI'
      const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'

      // minting transaction
      await certificateToken.mint(blockchainAddress, certificateURI, hash)

      try {
        await certificateToken.transferFrom(account01.address, certificateManager.address, 1)
      } catch (error) {}

      const result = await certificateToken.ownerOf(1)
      expect(result).to.equal(account01.address)
    })

    it('Get serial number of a certificate', async () => {
      // hard-coded setup for minting
      const blockchainAddress = [account01.address, account01.address, account02.address]
      const certificateURI = 'path to the URI'
      const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'

      for (let i = 0; i < blockchainAddress.length; i++) {
        // minting transaction
        await certificateToken.mint(blockchainAddress[i], certificateURI, hash)
      }
      const result = await certificateToken.getSerialNumber(account02.address, 0) // start at index ZERO
      expect(result).to.equal(3)
    })
  })
}

module.exports = certificateTokenTesting
