/**
 * @title Proposal
 * @author Fábio Benjovengo
 *
 * @notice Cast a vote for a propose
 *
 * @dev Usage: hardhat run scripts/vote.js --network localhost
 * @dev It is important not to forget the --network localhost to run this script
 *
 */
const hre = require("hardhat");
const fs = require("fs"); // to copy the files to be used by the web interface

const fastForwardBlocks = require("./utils/speedUpTime.js")
const speedUpSeconds = require("./utils/speedUpTimeSeconds.js")


/**
 * @title Voting main function
 * @author Fábio Benjovengo
 *
 */
const voteAction = async () => {
  /// Definitions
  const index = 0;
  const VOTE_NO = 0;
  const VOTE_YES = 1;
  const VOTE_ABSTAIN = 2;

  const PROPOSAL_FILE = './util/proposalsId.json' // json file created by propose.js script


  /// Get the proposal ID from file
  const proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
  /// @dev chainID - 31337: localhost; 5 - Goerli testnet
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const { chainId } = await provider.getNetwork()
  /// @dev the proposal ID is the value using the chainID as the key  
  const proposalId = proposals[chainId][0];

  /// Connect to Governor deployed contract
  const governorContract = await hre.ethers.getContractAt("GovernorContract", global.governorContract.address);

  const VOTE_REASON = "Explain why you are voting like that!"

  /// Cast a vote
  const voteTx = await governorContract.castVoteWithReason(
    proposalId,
    VOTE_YES,
    VOTE_REASON
  );
  voteTx.wait(1);

  let proposalState = await governorContract.state(proposalId);
  console.log(`Proposal State before voting period is over: ${proposalState}`);

  /// @notice Fast forward blocks
  /// @notice Speed up time so we can vote
  /// @dev fast forward only in localhost
  if (chainId === 31337) {
    await fastForwardBlocks(6) // VOTING_PERIOD + 1 - the VOTING_PERIOD is defined at deployment time
  }

  /// @notice Get the proposal state after the voting period
  /// @notice Status response
  ///   0: Pending
  ///   1: Active
  ///   2: Canceled
  ///   3: Defeated
  ///   4: Succeeded
  ///   5: Queued
  ///   6: Expired
  ///   7: Executed
  proposalState = await governorContract.state(proposalId);
  /* console.log(`Proposal State after voting period is over: ${proposalState}`);
  console.log("Voting complete."); */
  
  return proposalState
}

module.exports = voteAction