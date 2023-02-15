/// @notice Move time forward in the localhost
const speedUpSeconds = async (_seconds) => {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  await provider.send("evm_increaseTime", [_seconds]);
  // Console log the time moved forward
  // console.log(`Moved forward ${_seconds} seconds.`);
};

module.exports = speedUpSeconds;