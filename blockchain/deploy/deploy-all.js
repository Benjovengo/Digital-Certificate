/**
 * @dev ToDo - Separate in different files and save the addresses in a JSON file.
 * 
 * how to add key value pair in the JSON object already declared
 * 
  obj = {
    "1":"aa",
    "2":"bb"
  };

  var newNum = "3";
  var newVal = "cc";

  obj[newNum] = newVal;

  alert(obj["3"]); // this would alert 'cc'

 * the obj is the result of a JSON.parse(fs.readFileSync(JSON_FILE, "utf8")) command
 * 
 * 
 */




/* Run
   npx hardhat run deploy/deploy-all.js --network localhost
*/
// We require the Hardhat Runtime Environment for running the script in a 
// standalone fashion through `node <script>`.
const hre = require("hardhat");
const fs = require("fs"); // to copy the files to be used by the web interface


async function main() {
  /// Setup accounts
  /// to get signers use `const signers = await ethers.getSigners()`
  [deployer] = await ethers.getSigners()


  /**
   * @notice Deploy the Governance Token
   */
  /// Deploy Governance Token
  console.log("\n01-Deploying the Governance Token contract...");
  const VotingToken = await ethers.getContractFactory('VotingToken')
  const votingToken = await VotingToken.deploy()
  await votingToken.deployed()
  console.log(`Deployed 'VotingToken' at ${votingToken.address}`);

  /// Delegate votes to deployer.
  const txResponse = await votingToken.delegate(deployer.address);
  await txResponse.wait(1); /// wait 1 block
  console.log(
    `   Checkpoints: ${await votingToken.numCheckpoints(deployer.address)}`
  );
    console.log('   Delegated')

  /**
   * @notice Deploy the TimeLock Contract
   */
  /// Definitions for the TimeLock contract
  const MIN_DELAY = 3600;
  const PROPOSERS = [];
  const EXECUTORS = [];

  /// Deploy TimeLock
  console.log("\n02-Deploying the TimeLock contract...");
  const TimeLock = await ethers.getContractFactory('TimeLock')
  const timeLock = await TimeLock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS)
  await timeLock.deployed()
  console.log(`Deployed 'TimeLock' at ${timeLock.address}`);


  /**
   * @notice Deploy the Governor Contract
   */
  /// Definitions for the Governor Contract
  const VOTING_DELAY = 1; // blocks
  const VOTING_PERIOD = 5; // blocks
  const QUORUM_PERCENTAGE = 4; // percentage

  /// Deploy Governor contract
  console.log("\n03-Deploying the Governor contract...");
  const GovernorContract = await ethers.getContractFactory('GovernorContract')
  const governorContract = await GovernorContract.deploy(votingToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE)
  await governorContract.deployed()
  console.log(`Deployed 'GovernorContract' at ${governorContract.address}`);


  /**
   * @notice Setup the governance
   */
  /// Roles setup
  console.log("\n04-Setting up governance roles...");
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  const proposerTx = await timeLock.grantRole(proposerRole, governorContract.address);
  await proposerTx.wait(1);

  const executorTx = await timeLock.grantRole(executorRole, "0x0000000000000000000000000000000000000000");
  await executorTx.wait(1);

  /// make nobody the admin
  const revokeTx = await timeLock.revokeRole(adminRole, deployer.address);
  await revokeTx.wait(1);

  console.log("Roles setup OK. Deployer is no longer the admin for 'TimeLock'.");


  /**
   * @notice Deploy the ExpertiseClusters Contract
   */
  /// Deploy ExpertiseClusters contract
  console.log("\n05-Deploying the ExpertiseClusters contract...");
  const ExpertiseClusters = await ethers.getContractFactory('ExpertiseClusters')
  const expertiseClustersContract = await ExpertiseClusters.deploy()
  await expertiseClustersContract.deployed()
  console.log(`Deployed 'ExpertiseClusters' at ${expertiseClustersContract.address}`);

  /// only the TimeLock can call the ExpertiseClusters contract
  const transferTx = await expertiseClustersContract.transferOwnership(timeLock.address);
  await transferTx.wait(1);
  console.log("   Ownership of 'ExpertiseClusters' transferred to 'TimeLock' contract.\n");

  // @notice Save contracts' addresses
  fs.writeFileSync(
    './util/contractsAddresses.json',
    JSON.stringify({
      'GOVERNANCE_TOKEN_ADDRESS': [votingToken.address],
      'TIMELOCK_ADDRESS': [timeLock.address],
      'GOVERNOR_ADDRESS': [governorContract.address],
      'BOX_CONTRACT_ADDRESS': [expertiseClustersContract.address],
    }, null, " ")
  );

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});