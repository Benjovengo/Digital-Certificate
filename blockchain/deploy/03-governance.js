/**
 * @title Deployment script for the Governance Contracts
 * @author Fábio Benjovengo
 *
 * @dev Deployment scripts for the contracts responsible
 *      for the governance of the system.
 */
const { ethers } = require('hardhat')

const deployGovernance = async () => {
  console.log('\x1b[0m\nGovernance - Contracts Addresses and Setup')

  // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
  let deployer
  [deployer] = await ethers.getSigners()

  /**
   * Governance Token
   */
  // Deploy the voting token
  const VotingToken = await ethers.getContractFactory('VotingToken')
  const votingToken = await VotingToken.deploy()
  await votingToken.deployed()
  const votingTokenAddress = votingToken.address
  console.log(`   \x1b[34m✔\x1b[37m Voting Token deployed to          ${votingToken.address}\x1b[37m`)

  /// Delegate votes to deployer.
  const txResponse = await votingToken.delegate(deployer.address);
  await txResponse.wait(1); /// wait 1 block
  console.log(
    `       Checkpoints: ${await votingToken.numCheckpoints(deployer.address)}`
  );
  console.log('       Delegated')


  /**
   * TimeLock
   */
  /// Definitions for the TimeLock contract
  const MIN_DELAY = 3600
  const PROPOSERS = []
  const EXECUTORS = []
  // Deploy TimeLock
  const TimeLock = await ethers.getContractFactory('TimeLock')
  const timeLock = await TimeLock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS)
  await timeLock.deployed()
  const timeLockAddress = timeLock.address
  console.log(`   \x1b[34m✔\x1b[37m TimeLock deployed to              ${timeLock.address}\x1b[37m`)
  

  /**
   * Governor Contract
   */
  /// Definitions for the Governor Contract
  const VOTING_DELAY = 1 // blocks
  const VOTING_PERIOD = 5 // blocks
  const QUORUM_PERCENTAGE = 4 // percentage
  /// Deploy Governor contract
  const GovernorContract = await ethers.getContractFactory('GovernorContract')
  const governorContract = await GovernorContract.deploy(votingToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE)
  await governorContract.deployed()
  const governorAddress = governorContract.address
  console.log(`   \x1b[34m✔\x1b[37m Governor contract deployed to     ${governorContract.address}\x1b[37m`)

  
  /**
   * Governor Setup
   */
  /// Setup roles
  /// @dev This this to be placed after the deployment of the Governor contract because
  ///      the proposer role must be granted to the Governor contract address
  const proposerRole = await timeLock.PROPOSER_ROLE()
  const executorRole = await timeLock.EXECUTOR_ROLE()
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()
  // Set the proposer role
  const proposerTx = await timeLock.grantRole(proposerRole, governorContract.address)
  await proposerTx.wait(1)
  // Set the executor role
  // @dev To set the address to 0x means that anyone can be the executor
  const executorTx = await timeLock.grantRole(executorRole, '0x0000000000000000000000000000000000000000')
  await executorTx.wait(1)
  /// Make nobody the admin so that it is truly autonomous
  const revokeTx = await timeLock.revokeRole(adminRole, deployer.address)
  await revokeTx.wait(1)
  console.log(`       Roles setup for TimeLock OK.\x1b[37m`)


    /**
     * Expertise Clusters
     */
  // Deploy ExpertiseClusters
  const ExpertiseClusters = await ethers.getContractFactory('ExpertiseClusters')
  const expertiseClusters = await ExpertiseClusters.deploy()
  await expertiseClusters.deployed()
  const expertiseClustersAddress = expertiseClusters.address
  console.log(`   \x1b[34m✔\x1b[37m Expertise clusters deployed to    ${expertiseClusters.address}\x1b[37m`)


  /// only the TimeLock can call the Box contract
  const transferTx = await expertiseClusters.transferOwnership(timeLock.address);
  await transferTx.wait(1);
  console.log("       Ownership of 'Box' transferred to 'TimeLock' contract.\n");


  return [votingTokenAddress, timeLockAddress, governorAddress, expertiseClustersAddress]
}

module.exports = deployGovernance
