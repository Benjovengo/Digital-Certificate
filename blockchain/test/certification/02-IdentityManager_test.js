const { expect } = require('chai');
const { ethers } = require('hardhat');
const web3 = require('web3');

describe('Certification Manager', () => {
  /// Accounts
  let deployer, account01;
  /// Contracts
  let certificationToken;
  let certificationManager;

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners();

    // Deploy certification NFT token
    const CertificationToken = await ethers.getContractFactory('CertificationToken');
    certificationToken = await CertificationToken.deploy();

    // Deploy certification manager
    const CertificationManager = await ethers.getContractFactory('CertificationManager');
    certificationManager = await CertificationManager.deploy(certificationToken.address);

    // Only the CertificationManager can call CertificationToken functions - must be the owner of the token contract
    await certificationToken.transferOwnership(certificationManager.address);
  })

  it('Deployment address.', async () => {
    const result = await certificationManager.address;
    expect(result).to.not.equal("");
    expect(result).to.not.equal("0x");
  })

  it('Issue new certification - mint NFT token.', async () => {

    // hard-coded setup for minting
    const blockchainAddress = account01.address;
    const certificationURI = "path to the URI";
    const hash = '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    const publicKey = "0xC74a9a98Af6108adD8EB17A4262d3dc9B924c429";

    await certificationManager.connect(account01).createNewCertification(certificationURI, hash, publicKey)
    // get the owner of the certification/token
    const result = await certificationToken.ownerOf(1);
    expect(result).to.equal(account01.address);
  })


})



// TEMPLATES ==========================================================================================

//ADDRESSES
/**

    console.log('\nCertificationManager:   ', certificationManager.address)
    console.log('Deployer Address:  ', deployer.address);
    console.log('Account01 Address: ', account01.address,'\n')

 */

//console.log('\nOwner:    ', , '\n')

/* it('', async () => {
  await certificationToken.
  const result = await certificationToken.owner();
  console.log('\nOwner:    ', , '\n')
  expect(result).to.equal(certificationManager.address);
}) */
