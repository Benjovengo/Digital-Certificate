const { expect } = require('chai')
const { ethers } = require('hardhat')

const governorTesting = async () => {
  describe('Governor Contract', () => {
    let deployer

    beforeEach(async () => {
      // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
      [deployer] = await ethers.getSigners()

      /**
       * Governor Contract Deployment
       */
      /// Definitions for the Governor Contract
      const VOTING_DELAY = 1 // blocks
      const VOTING_PERIOD = 15 // blocks
      const QUORUM_PERCENTAGE = 4 // percentage

      /// Deploy Governor contract
      const GovernorContract = await ethers.getContractFactory('GovernorContract')
      global.governorContract = await GovernorContract.deploy(global.votingToken.address, global.timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE)

      /**
       * Governor Setup
       */
      /// Setup roles
      /// @dev This this to be placed after the deployment of the Governor contract because
      ///      the proposer role must be granted to the Governor contract address
      const proposerRole = await global.timeLock.PROPOSER_ROLE()
      const executorRole = await global.timeLock.EXECUTOR_ROLE()
      const adminRole = await global.timeLock.TIMELOCK_ADMIN_ROLE()
      // Set the proposer role
      const proposerTx = await global.timeLock.grantRole(proposerRole, global.governorContract.address)
      await proposerTx.wait(1)
      // Set the executor role
      // @dev To set the address to 0x means that anyone can be the executor
      const executorTx = await global.timeLock.grantRole(executorRole, '0x0000000000000000000000000000000000000000')
      await executorTx.wait(1)
      /// Make nobody the admin so that it is truly autonomous
      const revokeTx = await global.timeLock.revokeRole(adminRole, deployer.address)
      await revokeTx.wait(1)
    })

    it('Deployment address.', async () => {
      const result = await global.governorContract.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })
  })
}

module.exports = governorTesting
