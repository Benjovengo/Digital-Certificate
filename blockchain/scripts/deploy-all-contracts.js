var exec = require('child_process').exec;


const contractNames = [
  'deploy/01-IdentityToken.js',
  'deploy/02-IdentityManager.js'
];

const numberOfcontracts = contractNames.length;

/* let command = '';

for (var i = 0; i < numberOfcontracts; i++) {
  command = command + `npx hardhat run ${contractNames[i]} --network localhost; `
}

console.log(command)

exec(command,
  function (error, stdout, stderr) {
    console.log(stdout);
    if (error !== null) {
          console.log('exec error: ' + error);
    }
}); */


function execWrapper(command) {
  return new Promise((resolve, reject) => {
     exec(command, (error, out, err) => {
       if (error) return reject(error);
       resolve({out: out, err: err});
     })
  })
}


async function test() {
  const contractNames = [
    'deploy/01-IdentityToken.js',
    'deploy/02-IdentityManager.js'
  ];
  for (var i in contractNames) {
          try{
              console.log(contractNames[i])
              command = `npx hardhat run ${contractNames[i]} --network localhost`
              var promise = execWrapper(command)//any promise, doesn't matter now 
              await promise;
           }catch(err) {
            console.log("Promise Rejected");
            console.log(err)
           }
   }
}

test()

    /* await runScript("../deploy/01-IdentityToken.js");
    await runScript("../deploy/02-IdentityManager.js"); */
