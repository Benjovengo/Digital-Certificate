const { expect } = require('chai')

const proposeAction = require('../../propose')
const voteAction = require('../../vote')


let proposal
let votingResult

const governanceFunctionality = async () => {
  describe('Functionality Test', () => {

    it('Add a proposal (proposal state = 0: Pending).', async () => {
      proposal = await proposeAction()
      const proposalState = proposal[1]
      expect(proposalState).to.equal(1)
    })

    it('Vote (proposal state = : ).', async () => {
      /* votingResult = await voteAction()
      console.log('Proposal state: ', votingResult) */
    })

    it('Queue and Execute.', async () => {
    })

  })

}

module.exports = governanceFunctionality
