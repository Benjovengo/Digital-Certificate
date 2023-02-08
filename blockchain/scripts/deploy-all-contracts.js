const exec = require('child_process').exec;


const deploy = async (_file) => {
  console.log(`npx hardhat run ${_file} --network localhost`)
  exec(`npx hardhat run ${_file} --network localhost`,
    function (error, stdout, stderr) {
      console.log(stdout);
      if (error !== null) {
            console.log('exec error: ' + error);
      }
  });
}

const deployAll = async () => {
  const contracts = [
    'deploy/01-IdentityToken.js',
    'deploy/02-IdentityManager.js'
  ];
  const numberOfContracts = contracts.length;

  for (var i = 0; i < numberOfContracts; i++) {
    await deploy(contracts[i]);
  }

}

deployAll()