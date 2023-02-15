const { expect } = require('chai')

const proposeAction = require('../../propose')

let proposal

const governanceFunctionality = async () => {
  describe('Functionality Test', () => {

    it('Add a proposal (proposal state = 0: Pending).', async () => {
      // global.expertiseClusters
      proposal = await proposeAction()
      const proposalState = proposal[1]
      expect(proposalState).to.equal(0)
    })

    it('Vote (proposal state = : ).', async () => {
    })

    it('Queue and Execute.', async () => {
    })

  })

}

module.exports = governanceFunctionality
