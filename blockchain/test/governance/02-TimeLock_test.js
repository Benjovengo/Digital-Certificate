const { expect } = require('chai')
const { ethers } = require('hardhat')


describe('TimeLock Contract', () => {
  let deployer, account01
  let timeLock


  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners()

    /// Definitions for the TimeLock contract
    const MIN_DELAY = 3600;
    const PROPOSERS = [];
    const EXECUTORS = [];

    // Deploy TimeLock
    const TimeLock = await ethers.getContractFactory('TimeLock')
    timeLock = await TimeLock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS)
  })

  it('Deployment address.', async () => {
    const result = await timeLock.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })

})
