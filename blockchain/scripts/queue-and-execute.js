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
  /// @dev Arguments
  const _functionToCall = 'storeWeight'
  const _args = [1, 169] // has to be the same as in the proposal
  const _proposalDescription = 'Debug description'

  /// @dev Path to the file containing the addresses of the contracts after deployment
  const ADDRESSES_FILE = './util/contractsAddresses.json' // json file created upon deployment

  /// @dev Get the JSON with all the addresses from file
  const addressesFile = JSON.parse(fs.readFileSync(ADDRESSES_FILE, "utf8"));

  /// @dev Get the addresses for the contracts
  const GOVERNOR_ADDRESS = addressesFile['GOVERNOR_ADDRESS'][0];
  const BOX_CONTRACT_ADDRESS = addressesFile['BOX_CONTRACT_ADDRESS'][0];

  /// @dev Connect to Governor deployed contract
  const governorContract = await hre.ethers.getContractAt("GovernorContract", GOVERNOR_ADDRESS);
  /// @dev Connect to ExpertiseClusters deployed contract
  const expertiseClustersContract = await hre.ethers.getContractAt("ExpertiseClusters", BOX_CONTRACT_ADDRESS);

  /// @notice Encode the function to be called
  /// @dev <target_contract>.interface.encodeFunctionData(<function_name_string>,[<arguments>])
  const encodedFunctionCall = expertiseClustersContract.interface.encodeFunctionData(_functionToCall, _args)

  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_proposalDescription));

  const queueTx = await governorContract.queue(
    [expertiseClustersContract.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  queueTx.wait(1);

  console.log("Proposal queued....");

  /// @notice Get the chainID
  /// @dev ChainID = 31337 for the Hardhat localhost
  /// @dev ChainID = 5 for the Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const { chainId } = await provider.getNetwork()
  
  /// @notice Fast forward blocks
  /// @notice Speed up time so we can vote
  /// @dev fast forward only in localhost
  if (chainId === 31337) {
    const MIN_DELAY = 3600;
    await speedUpSeconds(MIN_DELAY + 1)
    await fastForwardBlocks(2) // VOTING_DELAY + 1 - the VOTING_DELAY is defined at deployment time
  }

  console.log("Executing....");
  const executeTx = await governorContract.execute(
    [expertiseClustersContract.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  executeTx.wait(1);

  console.log("Executed....");
  console.log(`ExpertiseClusters value: ${await expertiseClustersContract.retrieveWeight(1)}`);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});