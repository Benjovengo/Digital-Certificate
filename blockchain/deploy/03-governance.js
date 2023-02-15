/**
 * @title Deployment script for the Governance Contracts
 * @author Fábio Benjovengo
 * 
 * @dev Deployment scripts for the contracts responsible
 *      for the governance of the system.
 */
const deployGovernance = async () => {
  console.log('\x1b[0m\nGovernance - Contracts Addresses')

  // Deploy the voting token
  const VotingToken = await ethers.getContractFactory('VotingToken')
  const votingToken = await VotingToken.deploy()
  await votingToken.deployed()
  const votingTokenAddress = votingToken.address

  console.log(`\x1b[37m    Voting Token deployed to          ${votingToken.address}\x1b[37m`)

  return [votingTokenAddress]
}

module.exports = deployGovernance