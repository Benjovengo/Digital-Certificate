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
     * @dev Some of these variables are controlled by
     *      the governance decisions.
     */
    /// Array of the certificate level to be multiplied
    /// by the GPA to the actual score
    /// Controlled by the governance decision
    uint16[4] private certificateWeights = [1, 2, 4, 8];
    /// The expertise cluster defines the minimum values
    /// for a partucular expertise level
    /// @dev The levels are the:
    ///      0: novice
    ///      1: intermediate
    ///      2: expert
    /// @dev Each level must be between 0 and 65535
    /// @dev All the weights are set initially to one
    uint16[3] private expertiseClusters = [1, 1, 1];

    /**
     * Events
     */
    /// @dev This event is emitted when there is a change on the weight
    ///      for a particular level of certification
    event WeightsChanged(uint16[4] _newWeight);
    /// @dev This event is emitted when there is a change on the
    ///      points required for a particular level of expertise
    event ExpertiseThresholdChanged(uint16[3] _newThreshold);

    /**
     * Functions and Methods
     */

    /** Set/store the expertise levels threshold
     *
     * @ dev The threshold is an array of 3 elements.
     *       Classification:
     *       - novice: total points <  first threshold
     *       - intermediate: total points in [first threshold, second threshold]
     *       - expert: total points in [second threshold, third threshold]
     *       - jedi: total points >  third threshold
     * @dev The thresholds are set in percentages from 0 to 100%
     */
    function storeCertificateWeight(uint16[4] memory _newWeights)
        public
        onlyOwner
    {
        certificateWeights = _newWeights;
        emit WeightsChanged(_newWeights);
    }

    /** Retrieve the weights for all the academic levels
     *
     * @return {uint16[4]} Values of the weights for all
     *                     academic degrees
     * @ dev Return an array of 4 elements. Degrees considered:
     *       - Bachelor:     index=0
     *       - Masters:      index=1
     *       - Doctoral:     index=2
     *       - Postdoctoral: index=3
     */
    function retrieveCertificateWeight()
        public
        view
        returns (uint16[4] memory)
    {
        return certificateWeights;
    }

    /** Set/store the expertise levels threshold
     *
     * @ dev The threshold is an array of 3 elements.
     *       Classification:
     *       - novice: total points <  first threshold
     *       - intermediate: total points in [first threshold, second threshold]
     *       - expert: total points in [second threshold, third threshold]
     *       - jedi: total points >  third threshold
     * @dev The thresholds are set in percentages from 0 to 100%
     */
    function storeExpertiseThreshold(uint16[3] memory _newThreshold)
        public
        onlyOwner
    {
        expertiseClusters = _newThreshold;
        emit ExpertiseThresholdChanged(_newThreshold);
    }

    /** Retrieve the expertise levels threshold
     *
     * @return {uint16[4]} Values of the thresholds for all
     *                     levels of expertise in percentage
     * @ dev Return an array of 3 elements. Classification:
     *       - novice: total points <  first threshold
     *       - intermediate: total points in [first threshold, second threshold]
     *       - expert: total points in [second threshold, third threshold]
     *       - jedi: total points >  third threshold
     * @dev The thresholds are given in percentages from 0 to 100%
     */
    function retrieveExpertiseThreshold()
        public
        view
        returns (uint16[3] memory)
    {
        return expertiseClusters;
    }

    /** Retrieve the expertise levels threshold
     *
     * @return {uint16[4]} Values of the thresholds in points
     *                     for all levels of expertise
     * @ dev Return an array of 3 elements. Classification:
     *       - novice: total points <  first threshold
     *       - intermediate: total points in [first threshold, second threshold]
     *       - expert: total points in [second threshold, third threshold]
     *       - jedi: total points >  third threshold
     */
    function retrieveClustersInPoints() public view returns (uint16[3] memory) {
        uint16 points = 8 *
            (certificateWeights[0] +
                certificateWeights[1] +
                certificateWeights[2] +
                certificateWeights[3]);
        uint16[3] memory clustersInPoints = [
            points * expertiseClusters[0],
            points * expertiseClusters[1],
            points * expertiseClusters[2]
        ];
        return clustersInPoints;
    }
}
