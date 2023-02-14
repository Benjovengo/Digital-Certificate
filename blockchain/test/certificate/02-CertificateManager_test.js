const { expect } = require('chai');
const { ethers } = require('hardhat');
const web3 = require('web3');

describe('Certificate Manager', () => {
  /// Accounts
  let deployer, account01;
  /// Contracts
  let certificateToken;
  let certificateManager;

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners();

    // Deploy certificate NFT token
    const CertificateToken = await ethers.getContractFactory('CertificateToken');
    certificateToken = await CertificateToken.deploy();

    // Deploy certificate manager
    const CertificateManager = await ethers.getContractFactory('CertificateManager');
    certificateManager = await CertificateManager.deploy(certificateToken.address);

    // Only the CertificateManager can call CertificateToken functions - must be the owner of the token contract
    await certificateToken.transferOwnership(certificateManager.address);
  })

  it('Deployment address.', async () => {
    const result = await certificateManager.address;
    expect(result).to.not.equal("");
    expect(result).to.not.equal("0x");
  })

  it('Issue new certificate - mint NFT token.', async () => {

    // hard-coded setup for minting
    const blockchainAddress = account01.address;
    const level = 1;
    const gpa = 388;
    const certificateURI = "path to the URI";
    const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";

    await certificateManager.connect(account01).createNewCertificate(blockchainAddress, level, gpa, certificateURI, hash, publicKey)
    // get the owner of the certificate/token
    const result = await certificateToken.ownerOf(1);
    expect(result).to.equal(account01.address);
  })


})



// TEMPLATES ==========================================================================================

//ADDRESSES
/**

    console.log('\nCertificateManager:   ', certificateManager.address)
    console.log('Deployer Address:  ', deployer.address);
    console.log('Account01 Address: ', account01.address,'\n')

 */

//console.log('\nOwner:    ', , '\n')

/* it('', async () => {
  await certificateToken.
  const result = await certificateToken.owner();
  console.log('\nOwner:    ', , '\n')
  expect(result).to.equal(certificateManager.address);
}) */
