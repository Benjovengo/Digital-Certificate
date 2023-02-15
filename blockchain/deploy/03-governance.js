/**
 * @title Deployment script for the Governance Contracts
 * @author Fábio Benjovengo
 * 
 * @dev Deployment scripts for the contracts responsible
 *      for the governance of the system.
 */
const deployGovernance = async () => {
  console.log('\nGovernance - Contracts Addresses')

  // Deploy the voting token
  const VotingToken = await ethers.getContractFactory('VotingToken')
  const votingToken = await VotingToken.deploy()
  await votingToken.deployed()
  const votingTokenAddress = votingToken.address

  console.log(`    Voting Token deployed to          ${votingToken.address}`)

  return [votingTokenAddress]
}

module.exports = deployGovernance