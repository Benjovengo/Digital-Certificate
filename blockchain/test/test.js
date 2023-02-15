const { expect } = require('chai')
const { ethers } = require('hardhat')

// Identity Testings
const identityTokenTesting = require('../scripts/testings/identity/01-IdentityToken_test')
const identityManagerTesting = require('../scripts/testings/identity/02-IdentityManager_test')

// Certificate Testings
const certificateTokenTesting = require('../scripts/testings/certificate/01-CertificateToken_test')
const certificateManagerTesting = require('../scripts/testings/certificate/02-CertificateManager_test')


// Governance Testings
const governanceTokenTesting = require('../scripts/testings/governance/01-VotingToken_test')
const timeLockTesting = require('../scripts/testings/governance/02-TimeLock_test')
const governorTesting = require('../scripts/testings/governance/03-Governor_test')
const expertiseClustersTesting = require('../scripts/testings/governance/04-ExpertiseClusters_test')


// display color
const COLOR = '\x1b[1m\x1b[36m'

/**
 * Tests
 */
describe(COLOR + 'IDENTITY', () => {
  // Identity Token
  identityTokenTesting()
  // Identity Manager
  identityManagerTesting()
})


describe(COLOR + 'CERTIFICATE', () => {
  // Identity Token
  certificateTokenTesting()
  // Identity Manager
  certificateManagerTesting()
})


describe(COLOR + 'GOVERNANCE', () => {
  // Governance Token
  governanceTokenTesting()
  // TimeLock Contract
  timeLockTesting()
  // Governor Contract
  governorTesting()
  // Expertise Clusters Contract
  expertiseClustersTesting()
})
