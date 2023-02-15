const { expect } = require('chai')
const { ethers } = require('hardhat')


describe('Expertise Clusters Contract', () => {
  // Variables
  let deployer
  // Run before each test
  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer] = await ethers.getSigners()

    // Deploy ExpertiseClusters
    const ExpertiseClusters = await ethers.getContractFactory('ExpertiseClusters')
    global.expertiseClusters = await ExpertiseClusters.deploy()
  })


  it('Deployment address.', async () => {
    const result = await global.expertiseClusters.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })

  it('Change ownership to TimeLock.', async () => {
    const transferTx = await global.expertiseClusters.transferOwnership(global.timeLock.address);
    await transferTx.wait(1);
    const result = await await global.expertiseClusters.owner()
    expect(result).to.equal(global.timeLock.address)
  })

})
