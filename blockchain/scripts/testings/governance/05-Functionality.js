const { expect } = require('chai')
const { ethers } = require('hardhat')

const proposeAction = require( '../../propose')

const governanceFunctionality = async () => {
  describe('Functionality Test', () => {
    // Run before each test
    beforeEach(async () => {
      // global.expertiseClusters
      const proposalId = await proposeAction()
      console.log(proposalId)
    })


    it('Deployment address.', async () => {
      const result = await global.expertiseClusters.address
      expect(result).to.not.equal('')
      expect(result).to.not.equal('0x')
    })

  })
}

module.exports = governanceFunctionality