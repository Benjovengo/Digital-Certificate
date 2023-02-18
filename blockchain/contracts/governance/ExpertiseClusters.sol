// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @notice This contract is owned by the Timelock contract.
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Expertise Clusters - Governance (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * Define the expertise level based on the certificates and the corresponding GPA
 * grades to be in one of three levels: novice, intermediate, or expert.
 *
 * @notice Total score: the weighted sum of the certificates and its
 *         corresponding GPAs.
 *
 * The weights of the certificates are based on the level of the certificate.
 * The GPAs are also weighted.
 * The total score entry is: <weight[level]>*<certificate_level>*<GPA>,
 * where the weight[level] is controlled by the governance.
 *
 * @dev This contract is the target for the actions of the governor contract.
 * @dev This contract MUST be owned by the TimeLock contract.
 * @dev The weight state variable is a mapping that relates the level of the
 *      certificate to its actual weight.
 *
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract ExpertiseClusters is Ownable {
    /**
     * State variables
     *
     * @dev Some of these variables are controlled by the
     *      governance decisions.
     */
    /// Array of the weight of each certification level on
    /// the total points of the user
    /// @dev Controlled by the governance decision
    uint16[4] private certificateWeights = [1, 2, 4, 8];
    /// The expertise cluster defines the minimum values for a partucular expertise level
    /// @dev The levels are the indices of the array
    ///      0: novice
    ///      1: intermediate
    ///      2: expert
    /// @dev Each level must be between 0 and 65535
    /// @dev The threshold for each level are given
    ///      in percentage - from 0 t0 100
    uint16[3] private expertiseCluster = [60, 75, 90];

    /**
     * Events
     */
    /// @dev This event is emitted when there is a change on the weight
    ///      for a particular level of certification
    event WeightsChanged(uint16[4] _newWeight);
    /// @dev This event is emitted when there is a change on the
    ///      points required for a particular level of expertise
    event ExpertiseValueChanged(uint8 _expertiseLevel, uint256 _newWeight);

    /**
     * Functions and Methods
     */

    /**
     * Stores a new certificateWeight in the contract
     *
     * @dev Store values as an array of four elements from 0 to 65,535
     */
    function storeCertificateWeights(uint16[4] memory _newWeights)
        public
        onlyOwner
    {
        certificateWeights = _newWeights;
        emit WeightsChanged(_newWeights);
    }

    /** Read the weights
     *
     * @return {uint16[4]} Values of the weights for all levels of education
     * @ dev Return an array of 4 elements. Elements of the array:
     *       - index 0: bachelor
     *       - index 1: masters
     *       - index 2: doctoral
     *       - index 3: postdoctoral
     */
    function retrieveCertificateWeights()
        public
        view
        returns (uint16[4] memory)
    {
        return certificateWeights;
    }
}
