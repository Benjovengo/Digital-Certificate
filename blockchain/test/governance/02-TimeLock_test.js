const { expect } = require('chai')
const { ethers } = require('hardhat')


describe('TimeLock Contract', () => {
  let deployer, account01, account02
  let timeLock


  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01, account02] = await ethers.getSigners()

    /// Definitions for the TimeLock contract
    const MIN_DELAY = 3600;
    const PROPOSERS = [];
    const EXECUTORS = [];

    // Deploy TimeLock
    const TimeLock = await ethers.getContractFactory('TimeLock')
    timeLock = await TimeLock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS)

    /// Roles setup
    /// @dev This this to be placed after the deployment of the Governor contract because
    ///      the proposer role must be granted to the Governor contract address
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const executorTx = await timeLock.grantRole(executorRole, "0x0000000000000000000000000000000000000000");
    await executorTx.wait(1);

    /// make nobody the admin
    const revokeTx = await timeLock.revokeRole(adminRole, deployer.address);
    await revokeTx.wait(1);

  })


  it('Deployment address.', async () => {
    const result = await timeLock.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })


  it('Roles assignment.', async () => {
    let result
    try {
      const executor2Tx = await timeLock.grantRole(executorRole, "0x0000000000000000000000000000000000000001");
      await executor2Tx.wait(1);
      result = 0 // could grant role
    } catch (error) {
      result = 1 // couldn't grant role because the admin role for the deployer has been revoked
    }
    expect(result).to.equal(1)
  })
})
