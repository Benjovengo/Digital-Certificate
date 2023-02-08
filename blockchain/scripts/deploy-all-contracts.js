const exec = require('child_process').exec;

const contracts = [
  'deploy/01-IdentityToken.js',
  'deploy/02-IdentityManager.js'
]

for (const contract of contracts) {
  exec(`npx hardhat run ${contract} --network localhost`,
    function (error, stdout, stderr) {
      console.log(stdout);
      if (error !== null) {
            console.log('exec error: ' + error);
      }
  });
}
