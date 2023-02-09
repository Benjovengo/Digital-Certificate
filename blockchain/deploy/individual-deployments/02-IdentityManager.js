// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require("fs"); // to setup the files to be used by the web interface
const addEntryConfigJSON = require("./scripts/addAddress")
const createABIFile = require("./scripts/createABI")

let identityTokenAddress;
let identityManagerAddress;

async function main() {
  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  [deployer, account01] = await ethers.getSigners();


  /// Get IdentityToken address
  const configFilePath = "../front-end/src/config.json"; /// Path to the src/ folder of the front-end application
  let jsonRaw = fs.readFileSync(configFilePath,'utf8');
  let json = JSON.parse(jsonRaw);
  let chainId = Object.keys(json)[0];
  identityTokenAddress = json[chainId]["identityToken"]["address"];


  // deploy token contract
  const IdentityManager = await ethers.getContractFactory('IdentityManager')
  const identityManager = await IdentityManager.deploy(identityTokenAddress)
  await identityManager.deployed();
  identityManagerAddress = identityManager.address

  console.log(`Identity Manager contract deployed to ${identityManager.address}`);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () => {
  try {
    await main()
    /// Setup
    const contractPath = 'identity/' /// don't remove the forward slash! unless it is in the root of contracts folder
    const contractName = "identityManager" // Lowercase  first letter
    const contractAddress = identityManagerAddress
    const useNetwork = "localhost"
    
    // Save ABI component to client-side
    createABIFile(contractPath, contractName)

    // create config.json with deployed addresses
    addEntryConfigJSON(contractName, contractAddress)

    // terminate without errors
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()