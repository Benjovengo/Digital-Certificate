import { ethers } from 'ethers'


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

  // Get data from ProposalCreated event
  // @dev See https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor-ProposalCreated-uint256-address-address---uint256---string---bytes---uint256-uint256-string-
  // @dev Events are retrieved as filter objects
  const eventsFilter = await governorContract.filters.ProposalCreated()
  // @dev Pass the filter object through the queryFilter method for blocks from 0 to the latest
  const events = await governorContract.queryFilter(eventsFilter, 0, "latest")
  const targetsEvent = events[0]['args']['targets']
  const targetCalldatas = events[0]['args']['calldatas']
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(events[0]['args']['description']));


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

  /// Get the response of the proposal transaction
  const proposeReceipt = await proposeTx.wait();

  // Get the chainID
  // @dev ChainID = 31337 for the Hardhat localhost
  // @dev ChainID = 5 for the Goerli testnet
  const hardhatProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
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
      await hardhatProvider.send('evm_mine', [])
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
  executeTx.wait(1);

  console.log('SUCCESS!! Proposal added.')
}