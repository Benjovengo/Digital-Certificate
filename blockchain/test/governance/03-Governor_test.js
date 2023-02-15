const { expect } = require('chai')
const { ethers } = require('hardhat')


describe('Governor Contract', () => {
  let deployer, account01
  let votingToken
  let timeLock
  let governorContract


  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners()

    // Deploy VotingToken
    const VotingToken = await ethers.getContractFactory('VotingToken')
    votingToken = await VotingToken.deploy()

    // Deploy TimeLock
    const MIN_DELAY = 3600;
    const PROPOSERS = [];
    const EXECUTORS = [];
    const TimeLock = await ethers.getContractFactory('TimeLock')
    timeLock = await TimeLock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS)


    /**
     * Governor Contract Deployment
     */
    /// Definitions for the Governor Contract
    const VOTING_DELAY = 1; // blocks
    const VOTING_PERIOD = 5; // blocks
    const QUORUM_PERCENTAGE = 4; // percentage

    /// Deploy Governor contract
    const GovernorContract = await ethers.getContractFactory('GovernorContract')
    governorContract = await GovernorContract.deploy(votingToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE)

    /**
     * Governor Setup
     */
    /// Roles setup
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
  })

  it('Deployment address.', async () => {
    const result = await governorContract.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })

})
