import { ethers } from 'ethers'

import { fastForwardBlocks } from '../utils/speedUpTime'
/** Contract(s) and Address(es) */
import GovernorContract from '../../abis/GovernorContract.json' // contract ABI
import ExpertiseClusters from '../../abis/ExpertiseClusters.json' // contract ABI
import config from '../../config.json' // contract addresses


/**
 * Place a proposal
 * @author Fábio Benjovengo
 * 
 * @param {string} _functionToCall Name of the function to call in the ExpertiseClusters contract
 * @param {uint16} _args Arguments of the function
 * @param {string} _proposalDescription Description of the proposal
 */
export const addProposal = async (_functionToCall, _args, _proposalDescription) => {
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer

  /// Javascript "version" of the smart contracts
  const governorContract = new ethers.Contract(config[network.chainId].governorContract.address, GovernorContract, signer)
  const expertiseClusters = new ethers.Contract(config[network.chainId].expertiseClusters.address, ExpertiseClusters, signer)

  /// Encode the function to be called
  /// @dev <target_contract>.interface.encodeFunctionData(<function_name_string>,[<arguments>])
  const encodedFunctionCall = expertiseClusters.interface.encodeFunctionData(_functionToCall, _args)

  /// Add the proposal
  const proposeTx = await governorContract.propose(
    [expertiseClusters.address],
    [0],
    [encodedFunctionCall],
    _proposalDescription
  );

  /// Get the response of the proposal transaction
  const proposeReceipt = await proposeTx.wait();

  /// Get the ID of the proposal
  const proposalId = proposeReceipt.events[0].args.proposalId;


  // Get the chainID
  // @dev ChainID = 31337 for the Hardhat localhost
  // @dev ChainID = 5 for the Goerli testnet
  const hardhatProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const { chainId } = await provider.getNetwork()
  /// @notice Fast forward blocks
  /// @notice Speed up time so we can vote
  /// @dev fast forward only in localhost
  if (chainId === 31337) {
    const numberOfBlocks = 2 // VOTING_DELAY + 1 - the VOTING_DELAY is defined at deployment time
    fastForwardBlocks(numberOfBlocks)
  }

  console.log('SUCCESS!! Proposal added.')
}