/**
 * Deployment Script
 *
 * @dev The deployment scripts relative to the different parts
 *      of the project are separated in different files for a
 *      better code organization.
 */

// Imports
// const { ethers } = require('hardhat')
const fs = require('fs') // to setup the files to be used by the web interface
const path = require('path');

// Deployment Scripts
const deployIdentity = require('./01-identity')
const deployCertificate = require('./02-certificate')
const deployGovernance = require('./03-governance')

// Propose an Action
//const proposeAction = require('../scripts/propose')

// Helper functions
const createConfigJSON = require('./utils/setupConfig')
const addEntryConfigJSON = require('./utils/addAddress')
const createABIFile = require('./utils/createABI')

// Accounts
// let deployer, account01

// Addresses variables
// @dev the naming convention is for the address is to
//      concatenate the <instanceName> with the word Address
let identityTokenAddress
let identityManagerAddress
let certificateTokenAddress
let certificateManagerAddress
let votingTokenAddress
let timeLockAddress
let governorContractAddress
let expertiseClustersAddress



const deployment = async () => {
  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  // [deployer, account01] = await ethers.getSigners()

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

  /**
   * Governance Contracts
   *
   * @dev Deployment scripts for the contracts responsible
   *      for the governance of the system.
   */
  const governanceAddresses = await deployGovernance()
  votingTokenAddress = governanceAddresses[0]
  timeLockAddress = governanceAddresses[1]
  governorContractAddress = governanceAddresses[2]
  expertiseClustersAddress = governanceAddresses[3]
}


/**
 * Search for JSON files that do NOT contain dbg in the name
 * 
 * @param {string} dir The base folder 
 * @param {array} fileList The list of JSON files that do NOT contain dbg in the name
 * @returns The list of JSON files that do NOT contain dbg in the name
 */
function findJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      findJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json') && !file.includes('dbg')) {
      fileList.push({
        path: path.relative(process.cwd(), path.dirname(filePath)) + '\\',
        name: file,
      });
    }
  });

  return fileList;
}


/**
 * Save the deployment information to files for the front-end application
 * 
 * @dev Traverse the directory tree and the path module to get the file
 *      name and relative path of each file that contains the ABI for a
 *      contract.
 */
const saveDeploymentInfo = async () => {
  // Setup
  const filesJSON = findJsonFiles('./artifacts/contracts')
  let contractPaths = []
  let contractNames = []
  let instanceNames = []
  let contractAddresses = []
  let notDeployed = []
  for (let i = 0; i < filesJSON.length; i++) {
    const contract = filesJSON[i]
    const contractPath = contract['path']
    const contractName = contract['name'].split('.')[0]
    const contractNameLowercase = contractName.charAt(0).toLowerCase() + contractName.slice(1)
    const contractAddress = contractNameLowercase + 'Address'
    try {
      contractAddresses.push(eval(contractAddress))
      contractPaths.push(contractPath)
      contractNames.push(contractName)
      instanceNames.push(contractNameLowercase)
    } catch (error) {
      notDeployed.push(`${contractName} not deployed!`)
    }
  }
  if (notDeployed.length !== 0) {
    console.log('\x1b[0m\nContracts NOT Deployed')
    for (let i = 0; i < notDeployed.length; i++) {
      console.log(`   \x1b[31m✘\x1b[37m ${notDeployed[i]}`)
    }
  }
  const useNetwork = 'localhost'
  // Save information to files
  for (let i = 0; i < contractNames.length; i++) {
    // Save ABI component to client-side
    createABIFile(contractPaths[i], contractNames[i])
    if (i === 0) {
      // create config.json with deployed addresses
      createConfigJSON(instanceNames[i], contractAddresses[i], useNetwork)
    } else {
      // create config.json with deployed addresses
      addEntryConfigJSON(instanceNames[i], contractAddresses[i])
    }
  }
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    // Deploy contracts
    await deployment()

    // Save the deployment information to files for the front-end application
    saveDeploymentInfo()

    // terminate without errors
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()
