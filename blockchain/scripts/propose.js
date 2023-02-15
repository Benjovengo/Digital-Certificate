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
 * @author Fábio Benjovengo
 * 
 */
const proposeAction = async () => {

  /// @dev Arguments
  global._functionToCall = 'storeWeight'
  global._args = [0, 45] // has to use the same value in the queue-and-execute.js script
  global._proposalDescription = 'Change the weight of the first level.'


  /// @dev Connect to the Governor contract
  const governorContract = await hre.ethers.getContractAt("GovernorContract", global.governorContract.address);

  /// @dev Connect to the ExpertiseClusters contract
  const expertiseClusters = await hre.ethers.getContractAt("ExpertiseClusters", global.expertiseClusters);


  /// Encode the function to be called
  /// @dev <target_contract>.interface.encodeFunctionData(<function_name_string>,[<arguments>])
  const encodedFunctionCall = expertiseClusters.interface.encodeFunctionData(_functionToCall, _args)

  /* 
  /// @dev Display the information about the function to be called in the target contract
  console.log("\nProposal Description: ", _proposalDescription);
  console.log("Function to call: ", _functionToCall);
  console.log("Args: ", _args);
  console.log("Encoded Function Call: ", encodedFunctionCall, '\n');
  */
  

  /// Add the proposal
  const proposeTx = await governorContract.propose(
    [global.expertiseClusters.address],
    [0],
    [encodedFunctionCall],
    _proposalDescription
  );

  /// Get the response of the proposal
  const proposeReceipt = await proposeTx.wait();

  
  /// Get the ID of the proposal
  const proposalId = proposeReceipt.events[0].args.proposalId;
  // console.log('\nProposal ID: ', proposalId.toString())
  
  /// Get the chainID
  /// @dev ChainID = 31337 for the Hardhat localhost
  /// @dev ChainID = 5 for the Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const { chainId } = await provider.getNetwork()
  // console.log('ChainID: ', chainId)

  /// Fast forward blocks
  /// @notice Speed up time (in blocks) so it is possible to vote immediately
  /// @dev fast forward only in localhost
  if (chainId === 31337) {
    await fastForwardBlocks(2) // VOTING_DELAY + 1 - the VOTING_DELAY is defined at deployment time
  }

  /// Save the chainID and the proposalID
  fs.writeFileSync(
    './util/proposalsId.json',
    JSON.stringify({
      [chainId.toString()]: [proposalId.toString()],
    })
  );


  /// Get the state of the proposal
  /// @dev The state of the proposal. 1 is not passed. 0 is passed.
  const proposalState = await governorContract.state(proposalId);
  // console.log(`Current Proposal State: ${proposalState}`);


  return [proposalId.toString(), proposalState]
}


module.exports = proposeAction