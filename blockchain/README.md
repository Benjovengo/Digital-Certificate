# Hardhat Console

On `npx hardhat console`, attach the address of the deployed contract to interact with

```javascript
const MyContract = await ethers.getContractFactory("MyContract");
const contract = await MyContract.attach(
  "0x..." // The deployed contract address
);

// Now you can call functions of the contract
await contract.doTheThing();
```

Or

`hardhat-ethers ^2.0.0` has a special function `getContractAt` for exactly this purpose:

```javascript
const contractAddress = "0x...",
const myContract = await hre.ethers.getContractAt("MyContract", contractAddress);
```

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
