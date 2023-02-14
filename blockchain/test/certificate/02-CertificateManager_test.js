const { expect } = require('chai');
const { ethers } = require('hardhat');
const web3 = require('web3');

describe('Certificate Manager', () => {
  /// Accounts
  let deployer, account01, account02;
  /// Contracts
  let certificateToken;
  let certificateManager;

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01, account02] = await ethers.getSigners();

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

  it('Get the number of certificates for an account.', async () => {
    // hard-coded setup for minting
    const blockchainAddress = account01.address;
    const level = 1;
    const gpa = 388;
    const certificateURI = "path to the URI";
    const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";
    const certificatesLength = 1 // number of certificates
    // create certificates
    for (let i = 0; i < certificatesLength; i++) {
      await certificateManager.connect(account01).createNewCertificate(blockchainAddress, level, gpa, certificateURI, hash, publicKey)
    }
    // get the number of certificates
    const result = await certificateManager.getNumberOfCertificates(blockchainAddress);
    expect(result).to.equal(certificatesLength);
  })

  it('Get the number of addresses with one or more certificates.', async () => {
    // hard-coded setup for minting
    const blockchainAddresses = [account01.address, account02.address, account01.address];
    const level = 1;
    const gpa = 388;
    const certificateURI = "path to the URI";
    const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";

    for (let i = 0; i < blockchainAddresses.length; i++) {
      await certificateManager.createNewCertificate(blockchainAddresses[i], level, gpa, certificateURI, hash, publicKey)
    }
    // get the owner of unique addresses 
    const result = await certificateManager.getNumberOfAddresses();
    expect(result).to.equal(2);
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
