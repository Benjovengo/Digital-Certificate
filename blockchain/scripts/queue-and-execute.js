/**
 * @title Proposal
 * @author Fábio Benjovengo
 * 
 * @notice Queue and execute the proposed action
 * 
 * @dev Usage: hardhat run scripts/queue-and-execute.js --network localhost
 * @dev It is important not to forget the --network localhost to run this script
 */
const hre = require("hardhat");
const fs = require("fs"); // to copy the files to be used by the web interface

const fastForwardBlocks = require("./utils/speedUpTime.js")
const speedUpSeconds = require("./utils/speedUpTimeSeconds.js")


/**
 * @title Main function to queue and execute the action
 * 
 */
async function main() {
  console.log('\x1b[0m\nQueue and Execute')
  // @dev Path to the file containing the addresses of the contracts after deployment
  const ADDRESSES_FILE = './util/contractsAddresses.json' // json file created upon deployment

  // @dev Get the JSON with all the addresses from file
  const addressesFile = JSON.parse(fs.readFileSync(ADDRESSES_FILE, "utf8"));

  // @dev Get the addresses for the contracts
  const GOVERNOR_ADDRESS = addressesFile['GOVERNOR_ADDRESS'][0];
  const BOX_CONTRACT_ADDRESS = addressesFile['BOX_CONTRACT_ADDRESS'][0];

  // @dev Connect to Governor deployed contract
  const governorContract = await hre.ethers.getContractAt("GovernorContract", GOVERNOR_ADDRESS);
  // @dev Connect to ExpertiseClusters deployed contract
  const expertiseClustersContract = await hre.ethers.getContractAt("ExpertiseClusters", BOX_CONTRACT_ADDRESS);
 
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
  // @dev Necessary when using the TimeLock
  const queueTx = await governorContract.queue(
    targetsEvent,
    [0],
    targetCalldatas,
    descriptionHash
  );
  queueTx.wait(1);
  console.log(`   \x1b[34m*\x1b[37m Proposal queued....`)

  // @notice Get the chainID
  // @dev ChainID = 31337 for the Hardhat localhost
  // @dev ChainID = 5 for the Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const { chainId } = await provider.getNetwork()
  
  // @notice Fast forward blocks
  // @notice Speed up time so we can vote
  // @dev fast forward only in localhost
  if (chainId === 31337) {
    const MIN_DELAY = 3600;
    await speedUpSeconds(MIN_DELAY + 1)
    await fastForwardBlocks(2) // VOTING_DELAY + 1 - the VOTING_DELAY is defined at deployment time
  }

  console.log(`   \x1b[34m*\x1b[37m Executing....`)
  // Execute the proposed action
  // @dev The execute function uses the same arguments as the queue function
  const executeTx = await governorContract.execute(
    targetsEvent,
    [0],
    targetCalldatas,
    descriptionHash
  );
  executeTx.wait(1);

  const weights = [
    await expertiseClustersContract.retrieveExpertiseThreshold(0),
    await expertiseClustersContract.retrieveExpertiseThreshold(1),
    await expertiseClustersContract.retrieveExpertiseThreshold(2)
  ]
  console.log(`   \x1b[34m*\x1b[37m ExpertiseClusters stored weights: [${weights}]`)
  console.log(`   \x1b[32m✔\x1b[37m Actions executed.`)
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});