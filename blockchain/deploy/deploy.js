// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require("fs"); // to setup the files to be used by the web interface
const createConfigJSON = require("./scripts/setupConfig")
const addEntryConfigJSON = require("./scripts/addAddress")
const createABIFile = require("./scripts/createABI")

let identityTokenAddress;
let identityManagerAddress;
let certificationTokenAddress;
let certificationManagerAddress;

async function main() {
  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  [deployer, account01] = await ethers.getSigners();


  // deploy identity token contract
  const IdentityToken = await ethers.getContractFactory('IdentityToken')
  const identityToken = await IdentityToken.deploy()
  await identityToken.deployed();
  identityTokenAddress = identityToken.address

  console.log(`Identity Token contract deployed to ${identityToken.address}`);


  // deploy identity manager contract
  const IdentityManager = await ethers.getContractFactory('IdentityManager')
  const identityManager = await IdentityManager.deploy(identityTokenAddress)
  await identityManager.deployed();
  identityManagerAddress = identityManager.address

  console.log(`Identity Manager contract deployed to ${identityManager.address}`);

  // Only the IdentityManager can call IdentityToken functions - must be the owner of the token contract
  await identityToken.transferOwnership(identityManagerAddress);


  // deploy certification token contract
  const CertificationToken = await ethers.getContractFactory('CertificationToken')
  const certificationToken = await CertificationToken.deploy()
  await certificationToken.deployed();
  certificationTokenAddress = certificationToken.address

  console.log(`Certification Token contract deployed to ${certificationToken.address}`);


  // deploy certification manager contract
  const CertificationManager = await ethers.getContractFactory('CertificationManager')
  const certificationManager = await CertificationManager.deploy(certificationTokenAddress)
  await certificationManager.deployed();
  certificationManagerAddress = identityManager.address

  console.log(`Certification Manager contract deployed to ${certificationManager.address}`);

  // Only the CertificationManager can call CertificationToken functions - must be the owner of the token contract
  await certificationToken.transferOwnership(certificationManagerAddress);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main()
    /// Setup
    const contractPaths = ['identity/', 'identity/', 'certification/', 'certification/'] /// don't remove the forward slash! unless it is in the root of contracts folder
    const contractNames = ["IdentityToken", "IdentityManager", "CertificationToken", "CertificationManager"] // Uppercase  first letter
    const instanceNames = ["identityToken", "identityManager", "certificationToken", "certificationManager"] // Lowercase  first letter
    const contractAddresses = [identityTokenAddress, identityManagerAddress, certificationTokenAddress, certificationManagerAddress]
    const useNetwork = "localhost"
    
    for (let i = 0; i < contractNames.length; i++) {
      // Save ABI component to client-side
      createABIFile(contractPaths[i], contractNames[i])
      if (i==0) {
        // create config.json with deployed addresses
        createConfigJSON(instanceNames[i], contractAddresses[i], useNetwork)
      }
      else {
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