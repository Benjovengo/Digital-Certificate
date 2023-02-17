import { ethers } from 'ethers'

/** Contract(s) and Address(es) */
import ExpertiseClusters from '../../abis/ExpertiseClusters.json' // contract ABI
import config from '../../config.json' // contract addresses

/**
 * @title Fetch the parameters defined by the governance
 * @author Fábio Benjovengo
 * 
 * @return The weights for each of the different certification levels
 */
export const fetchDaoParams = async () => {
  // Setup provider and network
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()
  const signer = provider.getSigner() // get the signer

  /// Javascript "version" of the smart contract
  const expertiseClusters = new ethers.Contract(config[network.chainId].expertiseClusters.address, ExpertiseClusters, signer)

  let weight = []
  for (let i = 0; i < 3; i++) {
    weight.push(await expertiseClusters.retrieveExpertiseThreshold(i))    
  }

  return weight
}