const { expect } = require('chai')
const { ethers } = require('hardhat')
const { mine } = require("@nomicfoundation/hardhat-network-helpers");


const expertiseClustersTesting = async () => {

  let votingToken
  let timeLock
  let governorContract
  let expertiseClusters

  let proposalId

  describe('Expertise Clusters Contract', () => {
    // Run before each test
    beforeEach(async () => {
      // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
      const [deployer, account01] = await ethers.getSigners()
      // Deploy VotingToken
      const VotingToken = await ethers.getContractFactory('VotingToken')
      votingToken = await VotingToken.deploy()

      /// Definitions for the TimeLock contract
      const MIN_DELAY = 3600
      const PROPOSERS = []
      const EXECUTORS = []
      // Deploy TimeLock
      const TimeLock = await ethers.getContractFactory('TimeLock')
      timeLock = await TimeLock.deploy(MIN_DELAY, PROPOSERS, EXECUTORS)

      /**
       * Governor Contract Deployment
       */
      /// Definitions for the Governor Contract
      const VOTING_DELAY = 1 // blocks
      const VOTING_PERIOD = 15 // blocks
      const QUORUM_PERCENTAGE = 4 // percentage
      /// Deploy Governor contract
      const GovernorContract = await ethers.getContractFactory('GovernorContract')
      governorContract = await GovernorContract.deploy(global.votingToken.address, global.timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE)

      // Deploy ExpertiseClusters
      const ExpertiseClusters = await ethers.getContractFactory('ExpertiseClusters')
      expertiseClusters = await ExpertiseClusters.deploy()
    })

    it('Propose.', async () => {
      /// @dev Arguments
      const _functionToCall = 'storeCertificateWeight'
      const _args = [10, 12, 14, 16] // has to use the same in the queue-and-execute
      const _proposalDescription = 'Debug description'

      /// @notice Encode the function to be called
      /// @dev <target_contract>.interface.encodeFunctionData(<function_name_string>,[<arguments>])
      const encodedFunctionCall = expertiseClusters.interface.encodeFunctionData(_functionToCall, [_args])
      const EXPERTISE_CONTRACT_ADDRESS = await expertiseClusters.address

      /// @dev Display the information about the function to be called in the target contract
      /* console.log(`   \x1b[34m*\x1b[37m Proposal Description: ${_proposalDescription}`)
      console.log(`   \x1b[34m*\x1b[37m Function to call: ${_functionToCall}`)
      console.log(`   \x1b[34m*\x1b[37m Args: ${_args}`)
      console.log(`   \x1b[34m*\x1b[37m Encoded Function Call: ${encodedFunctionCall}`) */

      /// @notice Add the proposal
      const proposeTx = await governorContract.propose(
        [EXPERTISE_CONTRACT_ADDRESS],
        [0],
        [encodedFunctionCall],
        _proposalDescription
      );
      /// @notice Get the response of the proposal
      const proposeReceipt = await proposeTx.wait();

      /// @notice Get the ID of the proposal
      proposalId = proposeReceipt.events[0].args.proposalId;

      await mine(2)

      const proposalState = await governorContract.state(proposalId);
      expect(proposalState).to.equal(1)
    })
    
  })
}

module.exports = expertiseClustersTesting
