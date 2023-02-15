/**
 * @title Deployment script for the Certificate Contracts
 * @author Fábio Benjovengo
 *
 * @dev Deployment scripts for the contracts responsible
 *      for storing and managing the certificates.
 */
const { ethers } = require('hardhat')

const deployCertificate = async () => {
  console.log('\x1b[0m\nCertificate - Contracts Addresses')

  // Deploy certificate token contract
  const CertificateToken = await ethers.getContractFactory('CertificateToken')
  const certificateToken = await CertificateToken.deploy()
  await certificateToken.deployed()
  const certificateTokenAddress = certificateToken.address
  console.log(`   \x1b[34m✔\x1b[37m Certificate Token deployed to     ${certificateToken.address}`)

  // Deploy certificate manager contract
  const CertificateManager = await ethers.getContractFactory('CertificateManager')
  const certificateManager = await CertificateManager.deploy(certificateTokenAddress)
  await certificateManager.deployed()
  const certificateManagerAddress = certificateManager.address
  console.log(`   \x1b[34m✔\x1b[37m Certificate Manager deployed to   ${certificateManager.address}`)

  // Only the CertificateManager can call CertificateToken functions - must be the owner of the token contract
  await certificateToken.transferOwnership(certificateManagerAddress)

  return [certificateTokenAddress, certificateManagerAddress]
}

module.exports = deployCertificate
