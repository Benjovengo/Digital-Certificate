/**
 * @title Deployment script for the Certificate Contracts
 * @author Fábio Benjovengo
 *
 * @dev Deployment scripts for the contracts responsible
 *      for storing and managing the certificates.
 */
const { ethers } = require('hardhat')
const fs = require("fs")

const deployCertificate = async (_votingTokenAddress) => {
  console.log('\x1b[0m\nCertificate - Contracts Addresses')

  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  const [deployer] = await ethers.getSigners()

  // Deploy certificate token contract
  const CertificateToken = await ethers.getContractFactory('CertificateToken')
  const certificateToken = await CertificateToken.deploy()
  await certificateToken.deployed()
  const certificateTokenAddress = certificateToken.address
  console.log(`   \x1b[34m✔\x1b[37m Certificate Token deployed to     ${certificateToken.address}`)

  // Deploy certificate manager contract
  const CertificateManager = await ethers.getContractFactory('CertificateManager')
  const certificateManager = await CertificateManager.deploy(certificateTokenAddress, _votingTokenAddress)
  await certificateManager.deployed()
  const certificateManagerAddress = certificateManager.address
  console.log(`   \x1b[34m✔\x1b[37m Certificate Manager deployed to   ${certificateManager.address}`)

  // Only the CertificateManager can call CertificateToken functions - must be the owner of the token contract
  await certificateToken.transferOwnership(certificateManagerAddress)

  /// @dev Connect to VotingToken deployed contract
  const votingToken = await hre.ethers.getContractAt("VotingToken", _votingTokenAddress);
  /// Transfer the initial supply of voting tokens to the Governor contract
  await votingToken.approve(deployer.address, '1000000000000000000000000')
  await votingToken.transferFrom(deployer.address, certificateManager.address, '1000000000000000000000000')
  /// Transfer ownership of the Voting Token contract
  await votingToken.transferOwnership(certificateManager.address)


  // @notice Save contracts' addresses
  fs.writeFileSync(
    './util/certificateContractsAddresses.json',
    JSON.stringify({
      'CERTIFICATE_CONTRACT_ADDRESS': [certificateManagerAddress],
    }, null, " ")
  );

  return [certificateTokenAddress, certificateManagerAddress]
}

module.exports = deployCertificate
