// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs"); // to copy the files to be used by the web interface


let helloWorldAddress

async function main() {
  // Setup accounts
  [ account1, account2, account3 ] = await ethers.getSigners()

  // deploy contract
  const HelloWorld = await ethers.getContractFactory('HelloWorld')
  const helloWorld = await HelloWorld.deploy()
  await helloWorld.deployed();
  helloWorldAddress = helloWorld.address

  console.log(`Contract deployed to ${helloWorld.address}`);

}


// Function to copy the ABI files
function createABIFiles() {
  // Fashion Token ABI
  let jsonFile = fs.readFileSync('./artifacts/contracts/HelloWorld.sol/HelloWorld.json')
  let jsonData = JSON.parse(jsonFile);
  let stringfyData = JSON.stringify(jsonData.abi, null, " ")

  let abiFilePath = "../front-end/src/abis/HelloWorld.json"
  //writeData('../client/src/abis/FashionToken.sol', attribute)
  writeABIs(abiFilePath, stringfyData)

}


// write function
function writeABIs(_destination, _data) {
  // save new file
  var options = { flag : 'w' };
  fs.writeFileSync(_destination, _data , options, function(err) {
    if (err) throw err;
    console.log('complete');
  })
}
// Function to create/ update config.json file
function createConfigJSON(_helloWorldAddress) {
  const configFilePath = "../front-end/src/config.json";

  // Create data JSON with contents
  var data = {}
  data[31337] = [] //localhost

  data[31337] = {
    helloWorld: {
      address: _helloWorldAddress
    }
  }

  // save new file
  stringfyData = JSON.stringify(data, null, " ")
  var options = { flag : 'w' };
  fs.writeFileSync(configFilePath, stringfyData , options, function(err) {
    if (err) throw err;
    console.log('complete');
  })

}

const runMain = async () => {
  try {
    await main()
    // copy files to client-side
    createABIFiles()
    // create config.json with deployed addresses
    createConfigJSON(helloWorldAddress)
    // terminate without errors
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()