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
 *         corresponding GPAs
 *
 * The weights of the certificates are based on the level of the certificate
 * The GPAs are also weighted
 * The total score entry is: <weight[level]><certificate_level>*<GPA>,
 * where the weight[level] is controlled by the governance
 *
 * @dev The weight state variable is a mapping that relates the level of the
 *      certificate to its actual weight
 *
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract ExpertiseClusters is Ownable {
    /** State variables */
    /// @dev Mapping from the certificate level times the GPA
    ///      to the actual weight for the total score
    mapping(uint256 => uint256) private certificateWeight;

    /// @dev This event is emitted when there is a change on the weight
    ///      for a particular level of certification
    event ValueChanged(uint256 _certificateLevel, uint256 _newWeight);

    /// Stores a new certificateWeight in the contract
    function store(uint256 _certificateLevel, uint256 _newWeight)
        public
        onlyOwner
    {
        certificateWeight[_certificateLevel] = _newWeight;
        emit ValueChanged(_certificateLevel, _newWeight);
    }

    /// Reads the weight stored for a particular level of certification
    function retrieve(uint256 _newWeight) public view returns (uint256) {
        return certificateWeight[_newWeight];
    }
}
