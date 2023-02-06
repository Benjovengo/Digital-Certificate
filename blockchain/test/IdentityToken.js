const { expect } = require('chai');
const { ethers } = require('hardhat');
const web3 = require('web3');

describe('Identity ERC-721 Token', () => {
  let deployer, account01;
  let identityToken;

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners();

    // Deploy FashionToken
    const IdentityToken = await ethers.getContractFactory('IdentityToken');
    identityToken = await IdentityToken.deploy();
  })

  it('Deployment address.', async () => {
    const result = await identityToken.address;
    expect(result).to.not.equal("");
    expect(result).to.not.equal("0x");
  })

  it('Mint identity token.', async () => {
    const blockchainAddress = account01;
    const identityURI = "path to the URI"
    const hash = web3.utils.soliditySha3('Identity Hash');
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429"

    console.log('\nHash:    ', hash, '\n')

    //const mintTx = await identityToken.mint()
    //expect(result).to.equal("")
    //expect(result).to.not.equal("0x")
  })
})