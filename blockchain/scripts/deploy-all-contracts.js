var exec = require('child_process').exec;

exec('npx hardhat run deploy/01-IdentityToken.js --network localhost',
  function (error, stdout, stderr) {
    console.log(stdout);
    if (error !== null) {
          console.log('exec error: ' + error);
    }
});

exec('npx hardhat run deploy/02-IdentityManager.js --network localhost',
  function (error, stdout, stderr) {
    console.log(stdout);
    if (error !== null) {
          console.log('exec error: ' + error);
    }
});


    /* await runScript("../deploy/01-IdentityToken.js");
    await runScript("../deploy/02-IdentityManager.js"); */

