/**
   * @title Deployment script for the Identity Contracts
   * @author Fábio Benjovengo
   * 
   * @dev Deployment scripts for the contracts responsible
   *      for storing and managing the identities.
   */
  
const deployIdentity = async () => {
  console.log('\Identity - Contracts Addresses')

  // Deploy identity token contract
  const IdentityToken = await ethers.getContractFactory('IdentityToken')
  const identityToken = await IdentityToken.deploy()
  await identityToken.deployed()
  const identityTokenAddress = identityToken.address
  // Console log the address on the blockchain
  console.log(`   \x1b[34m✔\x1b[37m Identity Token deployed to        ${identityToken.address}`)

  // Deploy identity manager contract
  const IdentityManager = await ethers.getContractFactory('IdentityManager')
  const identityManager = await IdentityManager.deploy(identityTokenAddress)
  await identityManager.deployed()
  const identityManagerAddress = identityManager.address
  // Console log the address on the blockchain
  console.log(`   \x1b[34m✔\x1b[37m Identity Manager deployed to      ${identityManager.address}`)

  // Transfer the ownership of the Token contract
  // @dev Only the IdentityManager can call IdentityToken
  //      functions - must be the owner of the token contract
  await identityToken.transferOwnership(identityManagerAddress)

  return [identityTokenAddress, identityManagerAddress]
}

module.exports = deployIdentity