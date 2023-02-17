import { ethers } from 'ethers'


/**
 * Move blocks forward in the localhost
 * 
 * @param {int} _amount Number of blocks to mine in the local blockchain
 * 
 * @dev console.log(`Moved forward ${_amount} blocks.`)
 */
export const fastForwardBlocks = async (_amount) => {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
  for (let i = 0; i < _amount; i++) {
    await provider.send('evm_mine', [])
  }
}


/**
 * Move time forward in the localhost
 * 
 * @param {int} _seconds Time in seconds to be increased for the local blockchain
 * 
 * @dev console.log(`Moved forward ${_seconds} seconds.`)
 */
export const speedUpSeconds = async (_seconds) => {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
  await provider.send('evm_increaseTime', [_seconds])
}