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
const hre = require("hardhat");
const fs = require("fs"); // to copy the files to be used by the web interface

const fastForwardBlocks = require("./utils/speedUpTime.js")

/**
 * @title Make proposal main function
 * 
 */
async function main() {

  /// @dev Arguments
  const _functionToCall = 'storeWeight'
  const _args = [1, 169] // has to use the same in the queue-and-execute
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

  /// @dev Display the information about the function to be called in the target contract
  console.log("\nProposal Description: ", _proposalDescription);
  console.log("Function to call: ", _functionToCall);
  console.log("Args: ", _args);
  console.log("Encoded Function Call: ", encodedFunctionCall, '\n');
  

  /// @notice Add the proposal
  const proposeTx = await governorContract.propose(
    [BOX_CONTRACT_ADDRESS],
    [0],
    [encodedFunctionCall],
    _proposalDescription
  );

  /// @notice Get the response of the proposal
  const proposeReceipt = await proposeTx.wait();

  /// @notice Get the ID of the proposal
  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log('\nProposal ID: ', proposalId.toString())

  /// @notice Get the chainID
  /// @dev ChainID = 31337 for the Hardhat localhost
  /// @dev ChainID = 5 for the Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const { chainId } = await provider.getNetwork()
  console.log('ChainID: ', chainId)

  /// @notice Save the chainID and the proposalID
  fs.writeFileSync(
    './util/proposalsId.json',
    JSON.stringify({
      [chainId.toString()]: [proposalId.toString()],
    })
  );


  /// @notice Fast forward blocks
  /// @notice Speed up time so we can vote
  /// @dev fast forward only in localhost
  if (chainId === 31337) {
    await fastForwardBlocks(2) // VOTING_DELAY + 1 - the VOTING_DELAY is defined at deployment time
  }


  /// @notice Get the state of the proposal
  /// @notice The state of the proposal. 1 is not passed. 0 is passed.
  const proposalState = await governorContract.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});