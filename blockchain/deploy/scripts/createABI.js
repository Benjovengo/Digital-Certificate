const fs = require("fs"); // to setup the files to be used by the web interface


/**
 * Function to create the ABI files
 * 
 * @param {string} _path 
 * @param {string} _name 
 */
const createABIFile = (_path, _name) => {
  // Fashion Token ABI
  let jsonFile = fs.readFileSync(`./artifacts/contracts/${_path}${_name}.sol/${_name}.json`)
  let jsonData = JSON.parse(jsonFile);
  let stringfyData = JSON.stringify(jsonData.abi, null, " ")

  let abiFilePath = `../front-end/src/abis/${_name}.json`

  var options = { flag : 'w' };
  fs.writeFileSync(abiFilePath, stringfyData , options, function(err) {
    if (err) throw err;
  })
}

module.exports = createABIFile;