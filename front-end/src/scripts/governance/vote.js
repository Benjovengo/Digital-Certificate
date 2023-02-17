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
 */
export const castVote = async (_proposalId) => {
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer

  /// Javascript "version" of the smart contracts
  const governorContract = new ethers.Contract(config[network.chainId].governorContract.address, GovernorContract, signer)
  const expertiseClusters = new ethers.Contract(config[network.chainId].expertiseClusters.address, ExpertiseClusters, signer)


  console.log('SUCCESS!! Proposal added.')
}