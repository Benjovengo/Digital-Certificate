// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const createConfigJSON = require("../scripts/setupConfig")
const createABIFile = require("../scripts/createABI")

let certificationTokenAddress

async function main() {
  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  [deployer, account01, identityManager] = await ethers.getSigners();

  // deploy token contract
  const CertificationToken = await ethers.getContractFactory('CertificationToken')
  const certificationToken = await CertificationToken.deploy()
  await certificationToken.deployed();
  certificationTokenAddress = certificationToken.address

  console.log(`Certification Token contract deployed to ${certificationToken.address}`);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main()
    /// Setup
    const contractPath = 'certification/' /// don't remove the forward slash! unless it is in the root of contracts folder
    const contractName = "certificationToken" // Lowercase first letter
    const contractAddress = certificationTokenAddress
    const useNetwork = "localhost"
    
    // Save ABI component to client-side
    createABIFile(contractPath, contractName)

    // create config.json with deployed addresses
    createConfigJSON(contractName, contractAddress, useNetwork)

    // terminate without errors
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()