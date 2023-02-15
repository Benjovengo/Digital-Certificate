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

    /// Definitions for the Governor Contract
    const VOTING_DELAY = 1; // blocks
    const VOTING_PERIOD = 5; // blocks
    const QUORUM_PERCENTAGE = 4; // percentage

    /// Deploy Governor contract
    const GovernorContract = await ethers.getContractFactory('GovernorContract')
    governorContract = await GovernorContract.deploy(votingToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE)
  })

  it('Deployment address.', async () => {
    const result = await governorContract.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })

})
