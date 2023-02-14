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
    /// Contracts
    ExpertiseClusters public expertiseClusters;

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
