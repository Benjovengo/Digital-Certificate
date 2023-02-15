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


const queueAndExecute = async () => {

}

module.exports = queueAndExecute