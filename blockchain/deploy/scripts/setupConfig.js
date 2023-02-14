const fs = require('fs') // to setup the files to be used by the web interface

/// Path to the src/ folder of the front-end application
const configFilePath = '../front-end/src/config.json'

/**
 * Function to create the config.json file for the front-end application
 *
 * @param {string} _name the name of the contract
 * @param {struct} _address the contract's address on the network
 * @param {string} _network the name of the network to be used: "localhost" or "goerli"
 */
const createConfigJSON = (_name, _address, _network) => {
  /// Set the chain ID - 5: Goerli testnet; 31337: hardhat local network;
  let chainId = 0
  switch (_network) {
    case 'localhost':
      chainId = 31337
      break
    case 'goerli':
      chainId = 5
      break
  }

  /// Create data JSON with contents
  const data = {}
  data[chainId] = {}

  data[chainId][_name] = {
    address: _address
  }

  /// Save the new file in the front-end root folder
  stringfyData = JSON.stringify(data, null, ' ')
  const options = { flag: 'w' }
  fs.writeFileSync(configFilePath, stringfyData, options, function (err) {
    if (err) throw err
    console.log('complete')
  })
}

module.exports = createConfigJSON
