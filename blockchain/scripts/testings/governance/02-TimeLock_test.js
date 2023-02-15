const { expect } = require('chai')
const { ethers } = require('hardhat')


const timeLockTesting = async () => {
  describe('TimeLock Contract', () => {
    // Run before each test
    beforeEach(async () => {
      /// Definitions for the TimeLock contract
      const MIN_DELAY = 3600;
      const PROPOSERS = [];
      const EXECUTORS = [];
      // Deploy TimeLock
      const TimeLock = await ethers.getContractFactory('TimeLock')
      global.timeLock = await TimeLock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS)
    })


    it('Deployment address.', async () => {
      const result = await timeLock.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })

  })
}

module.exports = timeLockTesting