const { expect } = require('chai');
const { ethers } = require('hardhat');
const web3 = require('web3');

describe('Certification ERC-721 Token', () => {
  let deployer, account01, certificationManager;
  let certificationToken;

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01, certificationManager] = await ethers.getSigners();

    // Deploy CertificationToken
    const CertificationToken = await ethers.getContractFactory('CertificationToken');
    certificationToken = await CertificationToken.deploy();
  })

  it('Deployment address.', async () => {
    const result = await certificationToken.address;
    expect(result).to.not.equal("");
    expect(result).to.not.equal("0x");
  })

  it('Mint certification token.', async () => {
    // hard-coded setup for minting
    const blockchainAddress = account01.address;
    const certificationURI = "path to the URI";
    const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";

    // minting transaction
    await certificationToken.mint(blockchainAddress, certificationURI, hash, publicKey);
    // get the owner of the identity/token
    const result = await certificationToken.ownerOf(1);
    expect(result).to.equal(account01.address);
  })

  it('Transfer the ownership of the CertificationToken contract.', async () => {
    // Only the IdentityManager can call certain functions - owner of the token contract
    await certificationToken.transferOwnership(certificationManager.address);
    const result = await certificationToken.owner();
    expect(result).to.equal(certificationManager.address);
  })

  it('Prevent transfers', async () => {
    // hard-coded setup for minting
    const blockchainAddress = account01.address;
    const certificationURI = "path to the URI";
    const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";

    // minting transaction
    await certificationToken.mint(blockchainAddress, certificationURI, hash, publicKey);

    try {
      await certificationToken.transferFrom(account01.address, certificationManager.address, 1)
    } catch (error) {}

    const result = await certificationToken.ownerOf(1);
    expect(result).to.equal(account01.address);
  })

})

// TEMPLATES ==========================================================================================

//console.log('\nOwner:    ', , '\n')

/* it('', async () => {
  await certificationToken.
  const result = await certificationToken.owner();
  console.log('\nOwner:    ', , '\n')
  expect(result).to.equal(certificationManager.address);
}) */
