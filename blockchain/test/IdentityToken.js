const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Identity ERC-721 Token', () => {
  // variables
  let deployer, account01

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners()

    // Deploy FashionToken
    const IdentityToken = await ethers.getContractFactory('IdentityToken')
    identityToken = await IdentityToken.deploy()
  })

  it('Deployment Address.', async () => {
    const result = await identityToken.address
    expect(result).notEqual("")
  })
})