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
     * @dev Some of these variables are controlled by the governance decisions.
     */
    /// Mapping from the certificate level times the GPA
    /// to the actual weight for the total score
    /// Controlled by the governance decision
    mapping(uint256 => uint256) private certificateWeight;
    /// The expertise cluster defines the minimum values for a partucular expertise level
    /// @dev The levels are the indices of the array
    ///      0: novice
    ///      1: intermediate
    ///      2: expert
    /// @dev Each level must be between 0 and 65535
    /// @dev All the weights are set initially to one
    uint16[3] private expertiseCluster = [1, 1, 1];

    /**
     * Events
     */
    /// @dev This event is emitted when there is a change on the weight
    ///      for a particular level of certification
    event ValueChanged(uint256 _certificateLevel, uint256 _newWeight);

    /**
     * Functions and Methods
     */

    /// Stores a new certificateWeight in the contract
    function storeWeight(uint256 _certificateLevel, uint16 _newWeight)
        public
        onlyOwner
    {
        expertiseCluster[_certificateLevel] = _newWeight;
        emit ValueChanged(_certificateLevel, _newWeight);
    }

    /// Reads the weight stored for a particular level of certification
    function retrieveWeight(uint256 _level) public view returns (uint16) {
        return expertiseCluster[_level];
    }
}
