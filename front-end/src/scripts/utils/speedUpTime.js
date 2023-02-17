const { ethers } = require('hardhat')

/// @notice Move blocks forward in the localhost
const fastForwardBlocks = async (_amount) => {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
  for (let i = 0; i < _amount; i++) {
    await provider.send('evm_mine', [])
  }
  // Console log number of blocks moved forward
  // console.log(`Moved forward ${_amount} blocks.`);
}

module.exports = fastForwardBlocks
