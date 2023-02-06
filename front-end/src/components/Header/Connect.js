import ethers from 'ethers';

const handler = async (account, setAccount) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  setAccount(accounts[0])

  window.ethereum.on('accountsChanged', async () => {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = ethers.utils.getAddress(accounts[0])
    setAccount(account);
  })
}

export const connectHandler = handler();