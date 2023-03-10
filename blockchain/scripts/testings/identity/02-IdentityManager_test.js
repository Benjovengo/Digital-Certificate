const { expect } = require('chai')
const { ethers } = require('hardhat')

const identityManagerTesting = async () => {
  describe('Identity Manager', () => {
    /// Accounts
    let deployer, account01
    /// Contracts
    let identityToken
    let identityManager

    beforeEach(async () => {
      // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
      [deployer, account01] = await ethers.getSigners()

      // Deploy identity NFT token
      const IdentityToken = await ethers.getContractFactory('IdentityToken')
      identityToken = await IdentityToken.connect(deployer).deploy()

      // Deploy identity manager
      const IdentityManager = await ethers.getContractFactory('IdentityManager')
      identityManager = await IdentityManager.deploy(identityToken.address)

      // Only the IdentityManager can call IdentityToken functions - must be the owner of the token contract
      await identityToken.transferOwnership(identityManager.address)
    })

    it('Deployment address.', async () => {
      const result = await identityManager.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })

    it('Issue new identity - mint NFT token.', async () => {
      // hard-coded setup for minting
      const identityURI = 'path to the URI'
      const publicKey = '0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429'

      await identityManager.connect(account01).createNewId(identityURI, publicKey)
      // get the owner of the identity/token
      const result = await identityToken.ownerOf(1)
      expect(result).to.equal(account01.address)
    })
  })
}

module.exports = identityManagerTesting
