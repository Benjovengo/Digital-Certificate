/**
 * @title Proposal
 * @author Fábio Benjovengo
 *
 * @notice Propose an action to be voted
 *
 * @dev Usage: hardhat run scripts/propose.js --network localhost
 * @dev It is important not to forget the --network localhost to run this script
 *
 * @dev The OpenZeppelin Governor contract prevents the same proposal to be submitted more than once
 *
 */
const hre = require('hardhat')
const fs = require('fs') // to copy the files to be used by the web interface
const { ethers } = require('hardhat')

const fastForwardBlocks = require('./utils/speedUpTime.js')

/**
 * @title Make proposal main function
 * @author Fábio Benjovengo
 *
 */
const proposeAction = async () => {
  /// @dev Arguments
  global._functionToCall = 'storeWeight'
  global._args = [0, 45] // has to use the same value in the queue-and-execute.js script
  global._proposalDescription = 'Change the weight of the first level.'

  /// @dev Path to the file containing the addresses of the contracts after deployment
  const ADDRESSES_FILE = '../front-end/src/config.json' // json file created on deployment
  /// @dev Get the JSON with all the addresses from file
  const addressesJSON = JSON.parse(fs.readFileSync(ADDRESSES_FILE, "utf8"));
  const addresses31337 = addressesJSON['31337']

  /// @dev Get the addresses for the contracts
  const GOVERNOR_ADDRESS = (addresses31337['governorContract'])['address'];
  const EXPERTISE_CLUSTERS_ADDRESS = (addresses31337['expertiseClusters'])['address'];
  
  console.log(GOVERNOR_ADDRESS)
  console.log(EXPERTISE_CLUSTERS_ADDRESS)
  return



  /// @dev Connect to the Governor contract
  const governorContract = await hre.ethers.getContractAt('GovernorContract', GOVERNOR_ADDRESS)

  /// @dev Connect to the ExpertiseClusters contract
  const expertiseClusters = await hre.ethers.getContractAt('ExpertiseClusters', EXPERTISE_CLUSTERS_ADDRESS)

  /// Encode the function to be called
  /// @dev <target_contract>.interface.encodeFunctionData(<function_name_string>,[<arguments>])
  const encodedFunctionCall = expertiseClusters.interface.encodeFunctionData(global._functionToCall, global._args)

  /// Add the proposal
  const proposeTx = await governorContract.propose(
    [global.expertiseClusters.address],
    [0],
    [encodedFunctionCall],
    global._proposalDescription
  )

  /// Get the response of the proposal
  const proposeReceipt = await proposeTx.wait()

  /// Get the ID of the proposal
  const proposalId = proposeReceipt.events[0].args.proposalId
  // console.log('\nProposal ID: ', proposalId.toString())

  /// Get the chainID
  /// @dev ChainID = 31337 for the Hardhat localhost
  /// @dev ChainID = 5 for the Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
  const { chainId } = await provider.getNetwork()

  /// Fast forward blocks
  /// @notice Speed up time (in blocks) so it is possible to vote immediately
  /// @dev fast forward only in localhost
  if (chainId === 31337) {
    await fastForwardBlocks(5) // VOTING_DELAY + 1 - the VOTING_DELAY is defined at deployment time
  }

  /// Save the chainID and the proposalID
  fs.writeFileSync(
    './util/proposalsId.json',
    JSON.stringify({
      [chainId.toString()]: [proposalId.toString()]
    })
  )

  /// Get the state of the proposal
  /// @dev The state of the proposal. 1 is not passed. 0 is passed.
  const proposalState = await governorContract.state(proposalId)

  return [proposalId.toString(), proposalState]
}

module.exports = proposeAction
