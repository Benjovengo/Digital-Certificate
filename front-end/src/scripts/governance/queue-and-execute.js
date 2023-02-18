import { ethers } from 'ethers'


/** Contract(s) and Address(es) */
import GovernorContract from '../../abis/GovernorContract.json' // contract ABI
import config from '../../config.json' // contract addresses


/**
 * Queue and execute a succeeded proposal
 * @author Fábio Benjovengo
 * 
 * @param {string} _proposalId Id of the proposal to queue and execute
 */
export const queueAndExecute = async (_proposalId) => {
  // Setup provider and network
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
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
    if (eventProposalId === _proposalId){
      const targetsEvent = events[i]['args']['targets']
      const targetCalldatas = events[i]['args']['calldatas']
      const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(events[i]['args']['description']));

      // Queue the proposed action
      // @dev Necessary when using the TimeLock contract
      const queueTx = await governorContract.queue(
        targetsEvent,
        [0],
        targetCalldatas,
        descriptionHash
      );
      await queueTx.wait(1);
      console.log(`   Proposal queued....`)

      // Get the chainID
      // @dev ChainID = 31337 for the Hardhat localhost
      // @dev ChainID = 5 for the Goerli testnet
      const { chainId } = await provider.getNetwork()
      // Fast forward blocks - speed up time so we can vote
      // @dev fast forward only in localhost
      if (chainId === 31337) {
        // Advance in time
        const MIN_DELAY = 3600
        await provider.send('evm_increaseTime', [MIN_DELAY])
        // Advance in number of blocks
        const BLOCKS = 2 // VOTING_DELAY + 1 - the VOTING_DELAY is defined at deployment time
        for (let i = 0; i < BLOCKS; i++) {
          await provider.send('evm_mine', [])
        }
      }
      console.log(`   Executing....`)
      // Execute the proposed action
      // @dev The execute function uses the same arguments as the queue function
      const executeTx = await governorContract.execute(
        targetsEvent,
        [0],
        targetCalldatas,
        descriptionHash
      );
      await executeTx.wait(1);

      console.log('SUCCESS!! Proposal executed.')
    }
  }
}