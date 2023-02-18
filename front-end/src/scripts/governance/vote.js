import { ethers } from 'ethers'

/** Contract(s) and Address(es) */
import GovernorContract from '../../abis/GovernorContract.json' // contract ABI
import config from '../../config.json' // contract addresses


/**
 * Cast a vote
 * @author Fábio Benjovengo
 * 
 * @param {string} _proposalId Proposal ID for which to cast a vote
 * @param {uint} _vote Vote - 0: No; 1: Yes; 2: Abstain
 * @param {string} _reason Specify the reason for the vote
 */
export const castVote = async (_proposalId, _vote, _reason) => {
  // Setup provider and network
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer
  /// Javascript "version" of the smart contracts
  const governorContract = new ethers.Contract(config[network.chainId].governorContract.address, GovernorContract, signer)

  /// Cast a vote
  const voteTx = await governorContract.castVoteWithReason(
    _proposalId,
    _vote,
    _reason
  );
  await voteTx.wait(1)

  // Get the chain ID
  // @dev ChainID = 31337 for the Hardhat localhost
  // @dev ChainID = 5 for the Goerli testnet
  const { chainId } = await provider.getNetwork()
  // Fast forward blocks - speed up the number of blocks so it is possible to vote
  // @dev fast forward only in localhost
  if (chainId === 31337) {
    const amount = 6 // VOTING_PERIOD + 1 - the VOTING_PERIOD is defined at deployment time
    for (let i = 0; i < amount; i++) {
      await provider.send('evm_mine', [])
    }
  }
  console.log(`SUCCESS!! Voting is completed.`)
}