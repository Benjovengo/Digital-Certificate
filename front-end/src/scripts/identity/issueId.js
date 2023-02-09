import { ethers } from 'ethers';

/** Contract(s) and Address(es) */
import IdentityManager from '../abis/IdentityManager.json'; // contract ABI
import config from '../config.json'; // contract addresses

/* Register new product */
export const issueNewId = async (_tokenURI, _hash, _publicKey) => {
  // Setup provider and network
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  const signer = provider.getSigner(); // get the signer

  // Javascript "version" of the smart contract
  const identityManager = new ethers.Contract(config[network.chainId].identityManager.address, IdentityManager, signer);

  /// Create new Id Token
  await identityManager.register(_tokenURI, _hash, _publicKey)
}
