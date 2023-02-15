const fs = require('fs') // to setup the files to be used by the web interface

/// Path to the src/ folder of the front-end application
const configFilePath = '../front-end/src/config.json'

/**
 * Function to add other entries config.json file for the front-end application
 *
 * @param {string} _name the name of the contract
 * @param {struct} _address the contract's address on the network
 */
const addEntryConfigJSON = (_name, _address) => {
  // Read config.json file and get the JSON data
  const jsonRaw = fs.readFileSync(configFilePath, 'utf8')
  const json = JSON.parse(jsonRaw)

  /// Get the chain ID and append data
  const chainId = Object.keys(json)[0]
  json[chainId][_name] = {
    address: _address
  }

  /// Save the new file in the front-end root folder
  const stringfyData = JSON.stringify(json, null, ' ')
  const options = { flag: 'w' }
  fs.writeFileSync(configFilePath, stringfyData, options, function (err) {
    if (err) throw err
  })
}

module.exports = addEntryConfigJSON
