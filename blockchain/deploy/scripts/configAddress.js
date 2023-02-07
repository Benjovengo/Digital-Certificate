const fs = require("fs"); // to setup the files to be used by the web interface

/**
 * Function to create/ update config.json file for the front-end application
 * 
 * @param {struct} _addresses struct with the name of the contract and its address on the network
 * @param {string} _network the name of the network to be used: "localhost" or "goerli"
 */
const createConfigJSON = (_name, _address, _network) => {
  /// Path to the src/ folder of the front-end application
  const configFilePath = "../front-end/src/config.json";

  /// Set the chain ID - 5: Goerli testnet; 31337: hardhat local network;
  let chainId = 0;
  switch(_network) {
    case "localhost":
      chainId = 31337;
      break;
    case "goerli":
      chainId = 5;
      break;
  }

  /// Create data JSON with contents
  var data = {}
  data[chainId] = {}

  data[chainId][_name] = {
      address: _address
  }

  // save new file
  stringfyData = JSON.stringify(data, null, " ")
  var options = { flag : 'w' };
  fs.writeFileSync(configFilePath, stringfyData , options, function(err) {
    if (err) throw err;
    console.log('complete');
  })
}

module.exports = createConfigJSON;
