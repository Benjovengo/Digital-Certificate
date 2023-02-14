// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @dev Import the clusters contract to get the weights and the clusters' limits
import "../ExpertiseClusters.sol";
/// @dev Import the certificate manager to have access to the number of certificates owned by an account
import "../../certificate/CertificateManager.sol";

/**
 * @title Score Information - Governance (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * @notice Implementation of the contract to retrieve data about
 *         the score and cluster for a particular case.
 *
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract ScoreInfo {
    /**
     * State variables
     */

    /// Contracts
    ExpertiseClusters private expertiseClusters;
    CertificateManager private certificateManager;

    /**
     * Constructor Method
     *
     * @param _expertiseClusterAddress the address of the ExpertiseClusters contract on the blockchain (after deployment)
     */
    constructor(
        address _expertiseClusterAddress,
        address _certificateManagerAddress
    ) {
        expertiseClusters = ExpertiseClusters(_expertiseClusterAddress);
        certificateManager = CertificateManager(_certificateManagerAddress);
    }

    /**
     * Functions and Methods
     */

    /// Return the score of an account
    function accountScore(address _account) public view returns (uint256) {
        uint256 total = certificateManager.getNumberOfCertificates(_account);
        return total;
    }
}
