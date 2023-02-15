const { expect } = require('chai')
const { ethers } = require('hardhat')

const governanceTokenTesting = require('../scripts/testings/governance/01-VotingToken_test')
const timeLockTesting = require('../scripts/testings/governance/02-TimeLock_test')
const governorTesting = require('../scripts/testings/governance/03-Governor_test')
const expertiseClustersTesting = require('../scripts/testings/governance/04-ExpertiseClusters_test')

describe('GOVERNANCE', () => {
  // Governance Token
  governanceTokenTesting()
  // TimeLock Contract
  timeLockTesting()
  // Governor Contract
  governorTesting()
  // Expertise Clusters Contract
  expertiseClustersTesting()
})
