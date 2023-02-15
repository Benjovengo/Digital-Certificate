const { expect } = require('chai')
const { ethers } = require('hardhat')

const proposeAction = require( '../../propose')

let proposal

const governanceFunctionality = async () => {
  describe('Functionality Test', () => {
    // Run before each test
    beforeEach(async () => {
      // global.expertiseClusters
      proposal = await proposeAction()
    })


    it('Add a proposal (proposal state = 0: Pending).', async () => {
      const proposalState = proposal[1]
      expect(proposalState).to.equal(0)
    })

  })
}

module.exports = governanceFunctionality