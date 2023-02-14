// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @dev Import the clusters contract to get the weights and the clusters' limits
import "../ExpertiseClusters.sol";

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
    /// @notice Each certificate is assigned to a blockchain address and
    ///         each blockchain address may have several certificates.
    /// The relevant information of the certificate for calculating the
    /// score are the level of the certificate and the corresponding GPA.
    /// @dev mapping from address to a mapping from certificate_index to
    ///      its [level, gpa] (array)
    mapping(address => mapping(uint256 => uint16)) private certificateDetails;
    /// Stores the total number of certificates an address has
    /// @dev Used to track the certificateDetails for all certificates
    ///      issued to a particular blockchain address
    mapping(address => uint256) private numberOfCertificates;

    /// Contracts
    ExpertiseClusters public expertiseClusters;

    /**
     * Constructor Method
     *
     * @param _expertiseClusterAddress the address of the ExpertiseClusters contract on the blockchain (after deployment)
     */
    constructor(address _expertiseClusterAddress) {
        expertiseClusters = ExpertiseClusters(_expertiseClusterAddress);
    }

    /**
     * Functions and Methods
     */

    /// Read Score
    function readScoreElement(uint256 _certificate, uint256 _gpa)
        public
        pure
        returns (uint256)
    {
        return _certificate + _gpa;
    }
}
