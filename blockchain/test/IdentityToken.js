const { expect } = require('chai');
const { ethers } = require('hardhat');
const web3 = require('web3');

describe('Identity ERC-721 Token', () => {
  let deployer, account01, identityManager;
  let identityToken;

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01, identityManager] = await ethers.getSigners();

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
    // hard-coded setup for minting
    const blockchainAddress = account01.address;
    const identityURI = "path to the URI";
    const hash = web3.utils.soliditySha3('Identity Hash');
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";

    // minting transaction
    await identityToken.mint(blockchainAddress, identityURI, hash, publicKey);
    // get the owner of the identity/token
    const result = await identityToken.ownerOf(1);
    expect(result).to.equal(account01.address);
  })

  it('Transfer the ownership of the IdentityToken contract.', async () => {
    // Only the IdentityManager can call certain functions - owner of the token contract
    await identityToken.transferOwnership(identityManager.address);
    const result = await identityToken.owner();
    expect(result).to.equal(identityManager.address);
  })

})

//console.log('\nOwner:    ', , '\n')
//const mintTx = await identityToken.mint()
//expect(result).to.equal("")
//expect(result).to.not.equal("0x")
