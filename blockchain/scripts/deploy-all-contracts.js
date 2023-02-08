const exec = require('child_process').exec;

const contracts = [
  'deploy/01-IdentityToken.js'
]

contracts.forEach( function(contract, index) {
  exec(`npx hardhat run ${contract} --network localhost`,
    function (error, stdout, stderr) {
      console.log(stdout);
      if (error !== null) {
            console.log('exec error: ' + error);
      }
  });
});
