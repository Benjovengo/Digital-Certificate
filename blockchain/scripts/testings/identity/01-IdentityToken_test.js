const { expect } = require('chai')
const { ethers } = require('hardhat')

const identityTokenTesting = async () => {
  describe('Identity ERC-721 Token', () => {
    let deployer, account01, identityManager
    let identityToken

    beforeEach(async () => {
      // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
      [deployer, account01, identityManager] = await ethers.getSigners()

      // Deploy IdentityToken
      const IdentityToken = await ethers.getContractFactory('IdentityToken')
      identityToken = await IdentityToken.connect(deployer).deploy()
    })

    it('Deployment address.', async () => {
      const result = await identityToken.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })

    it('Mint identity token.', async () => {
      // hard-coded setup for minting
      const blockchainAddress = account01.address
      const identityURI = 'path to the URI'
      const publicKey = '0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429'

      // minting transaction
      await identityToken.mint(blockchainAddress, identityURI, publicKey)
      // get the owner of the identity/token
      const result = await identityToken.ownerOf(1)
      expect(result).to.equal(account01.address)
    })

    it('Transfer the ownership of the IdentityToken contract.', async () => {
      // Only the IdentityManager can call certain functions - owner of the token contract
      await identityToken.transferOwnership(identityManager.address)
      const result = await identityToken.owner()
      expect(result).to.equal(identityManager.address)
    })

    it('Prevent transfers', async () => {
      // hard-coded setup for minting
      const blockchainAddress = account01.address
      const identityURI = 'path to the URI'
      const publicKey = '0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429'

      // minting transaction
      await identityToken.mint(blockchainAddress, identityURI, publicKey)

      try {
        await identityToken.transferFrom(account01.address, identityManager.address, 1)
      } catch (error) {}

      const result = await identityToken.ownerOf(1)
      expect(result).to.equal(account01.address)
    })
  })
}

module.exports = identityTokenTesting
