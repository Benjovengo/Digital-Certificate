const { expect } = require('chai')
const { ethers } = require('hardhat')
const web3 = require('web3')

describe('Governor ERC-20 Voting Token', () => {
  let deployer, account01
  let votingToken


  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners()

    // Deploy VotingToken
    const VotingToken = await ethers.getContractFactory('VotingToken')
    votingToken = await VotingToken.deploy()
  })


  it('Deployment address.', async () => {
    const result = await votingToken.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })


  it('Mint voting token.', async () => {
    const result = await votingToken.balanceOf(deployer.address)
    expect(result.toString()).to.equal('1000000000000000000000000')
  })

  
  it('Delegate vote to account.', async () => {
    await votingToken.delegate(account01.address)
    const result01 = await votingToken.numCheckpoints(account01.address)
    const result02 = await votingToken.numCheckpoints(deployer.address)
    expect(result01).to.equal(1)
    expect(result02).to.equal(0)
  })

})
