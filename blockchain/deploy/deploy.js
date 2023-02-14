// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require('fs') // to setup the files to be used by the web interface
const createConfigJSON = require('./scripts/setupConfig')
const addEntryConfigJSON = require('./scripts/addAddress')
const createABIFile = require('./scripts/createABI')

let identityTokenAddress
let identityManagerAddress
let certificateTokenAddress
let certificateManagerAddress

async function main () {
  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  [deployer, account01] = await ethers.getSigners()

  // deploy identity token contract
  const IdentityToken = await ethers.getContractFactory('IdentityToken')
  const identityToken = await IdentityToken.deploy()
  await identityToken.deployed()
  identityTokenAddress = identityToken.address

  console.log(`Identity Token deployed to        ${identityToken.address}`)

  // deploy identity manager contract
  const IdentityManager = await ethers.getContractFactory('IdentityManager')
  const identityManager = await IdentityManager.deploy(identityTokenAddress)
  await identityManager.deployed()
  identityManagerAddress = identityManager.address

  console.log(`Identity Manager deployed to      ${identityManager.address}`)

  // Only the IdentityManager can call IdentityToken functions - must be the owner of the token contract
  await identityToken.transferOwnership(identityManagerAddress)

  // deploy certificate token contract
  const CertificateToken = await ethers.getContractFactory('CertificateToken')
  const certificateToken = await CertificateToken.deploy()
  await certificateToken.deployed()
  certificateTokenAddress = certificateToken.address

  console.log(`Certificate Token deployed to     ${certificateToken.address}`)

  // deploy certificate manager contract
  const CertificateManager = await ethers.getContractFactory('CertificateManager')
  const certificateManager = await CertificateManager.deploy(certificateTokenAddress)
  await certificateManager.deployed()
  certificateManagerAddress = certificateManager.address

  console.log(`Certificate Manager deployed to   ${certificateManager.address}`)

  // Only the CertificateManager can call CertificateToken functions - must be the owner of the token contract
  await certificateToken.transferOwnership(certificateManagerAddress)
}

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
