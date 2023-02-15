const { expect } = require('chai')
const { ethers } = require('hardhat')

const expertiseClustersTesting = async () => {
  describe('Expertise Clusters Contract', () => {
    // Run before each test
    beforeEach(async () => {
      // Deploy ExpertiseClusters
      const ExpertiseClusters = await ethers.getContractFactory('ExpertiseClusters')
      global.expertiseClusters = await ExpertiseClusters.deploy()
    })

    it('Deployment address.', async () => {
      const result = await global.expertiseClusters.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })

    it('Change ownership to TimeLock.', async () => {
      const transferTx = await global.expertiseClusters.transferOwnership(global.timeLock.address)
      await transferTx.wait(1)
      const result = await await global.expertiseClusters.owner()
      expect(result).to.equal(global.timeLock.address)
    })
  })
}

module.exports = expertiseClustersTesting
