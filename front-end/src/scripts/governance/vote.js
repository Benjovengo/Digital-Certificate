import { ethers } from 'ethers'

/** Contract(s) and Address(es) */
import GovernorContract from '../../abis/GovernorContract.json' // contract ABI
import ExpertiseClusters from '../../abis/ExpertiseClusters.json' // contract ABI
import config from '../../config.json' // contract addresses


/**
 * Cast a vote
 * @author Fábio Benjovengo
 * 
 * @param {string} _proposalId Proposal ID for which to cast a vote
 * @param {uint} _vote Vote - 0: No; 1: Yes; 2: Abstain
 * @param {string} _reason Specify the reason for the vote
 */
export const castVote = async (_proposalId, _vote, _reason) => {
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer

  /// Javascript "version" of the smart contracts
  const governorContract = new ethers.Contract(config[network.chainId].governorContract.address, GovernorContract, signer)
  const expertiseClusters = new ethers.Contract(config[network.chainId].expertiseClusters.address, ExpertiseClusters, signer)

  /// Cast a vote
  const voteTx = await governorContract.castVoteWithReason(
    _proposalId,
    _vote,
    _reason
  );

  let proposalState = await governorContract.state(_proposalId);
  console.log(`   Proposal State before voting period is over: ${proposalState}`)

  // Get the chainID
  // @dev ChainID = 31337 for the Hardhat localhost
  // @dev ChainID = 5 for the Goerli testnet
  const hardhatProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const { chainId } = await provider.getNetwork()
  // Fast forward blocks - speed up time so we can vote
  // @dev fast forward only in localhost
  if (chainId === 31337) {
    const amount = 6 // VOTING_PERIOD + 1 - the VOTING_PERIOD is defined at deployment time
    for (let i = 0; i < amount; i++) {
      await hardhatProvider.send('evm_mine', [])
    }
  }
  proposalState = await governorContract.state(_proposalId);
  console.log(`   Proposal State after voting period is over: ${proposalState}`)
  console.log(`   Voting is completed.`)

  console.log('SUCCESS!! Proposal added.')
}