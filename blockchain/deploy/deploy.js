/**
 * Deployment Script
 * 
 * @dev The deployment scripts relative to the different parts
 *      of the project are separated in different files for a 
 *      better code organization.
 */

const fs = require('fs') // to setup the files to be used by the web interface

// Deployment Scripts
const deployIdentity = require('./01-identity')
const deployCertificate = require('./02-certificate')

// Helper functions
const createConfigJSON = require('./utils/setupConfig')
const addEntryConfigJSON = require('./utils/addAddress')
const createABIFile = require('./utils/createABI')

let identityTokenAddress
let identityManagerAddress
let certificateTokenAddress
let certificateManagerAddress

async function main () {
  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  [deployer, account01] = await ethers.getSigners()

  /**
   * Identity Contracts
   * 
   * @dev Deployment scripts for the contracts responsible
   *      for storing and managing the identities
   */
  const identityAddresses = await deployIdentity()
  identityTokenAddress = identityAddresses[0]
  identityManagerAddress = identityAddresses[1]


  /**
   * Certificate Contracts
   * 
   * @dev Deployment scripts for the contracts responsible
   *      for storing and managing the certificates
   */
  const certificateAddresses = await deployCertificate()
  certificateTokenAddress = certificateAddresses[0]
  certificateManagerAddress = certificateAddresses[1]
}

/**
   * Governance Contracts
   * 
   * @dev Deployment scripts for the contracts responsible
   *      for the governance of the system.
   */

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main()
    /// Setup
    const contractPaths = ['identity/', 'identity/', 'certificate/', 'certificate/'] /// don't remove the forward slash! unless it is in the root of contracts folder
    const contractNames = ['IdentityToken', 'IdentityManager', 'CertificateToken', 'CertificateManager'] // Uppercase  first letter
    const instanceNames = ['identityToken', 'identityManager', 'certificateToken', 'certificateManager'] // Lowercase  first letter
    const contractAddresses = [identityTokenAddress, identityManagerAddress, certificateTokenAddress, certificateManagerAddress]
    const useNetwork = 'localhost'

    for (let i = 0; i < contractNames.length; i++) {
      // Save ABI component to client-side
      createABIFile(contractPaths[i], contractNames[i])
      if (i == 0) {
        // create config.json with deployed addresses
        createConfigJSON(instanceNames[i], contractAddresses[i], useNetwork)
      } else {
        // create config.json with deployed addresses
        addEntryConfigJSON(instanceNames[i], contractAddresses[i])
      }
    }

    // terminate without errors
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()
