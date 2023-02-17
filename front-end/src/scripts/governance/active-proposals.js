import { ethers } from 'ethers'

/** Contract(s) and Address(es) */
import GovernorContract from '../../abis/GovernorContract.json' // contract ABI
import config from '../../config.json' // contract addresses


/**
 * Fetch the proposals with the active status
 * @author Fábio Benjovengo
 * 
 * @param {uint} _state Filter the proposals with the specified state
 * @returns Array with the active proposals object
 * @dev The object has two keys: id and desc
 */
export const fetchActiveProposals = async (_state) => {
  let activeProposals = []
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer

  /// Javascript "version" of the smart contracts
  const governorContract = new ethers.Contract(config[network.chainId].governorContract.address, GovernorContract, signer)

  // Get data from ProposalCreated event
  // @dev See https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-ProposalCreated-uint256-address-address---uint256---string---bytes---uint256-uint256-string-
  // @dev Events are retrieved as filter objects
  const eventsFilter = await governorContract.filters.ProposalCreated()
  // @dev Pass the filter object through the queryFilter method for blocks from 0 to the latest
  const events = await governorContract.queryFilter(eventsFilter, 0, "latest")

  for (let i = 0; i < events.length; i++) {
    const eventProposalId = events[i]['args']['proposalId'].toString()
    const eventDescription = events[i]['args']['description']
    const proposalState = await governorContract.state(eventProposalId)
    if (proposalState === _state) {
      const active = {
        id: eventProposalId,
        desc: eventDescription
      }
      activeProposals.push(active)
    }
  }

  return activeProposals
}