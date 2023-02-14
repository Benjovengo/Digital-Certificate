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
    uint256 private certificateWeight;

    // Emitted when the stored certificateWeight changes
    event ValueChanged(uint256 newValue);

    // Stores a new certificateWeight in the contract
    function store(uint256 newValue) public onlyOwner {
        certificateWeight = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored certificateWeight
    function retrieve() public view returns (uint256) {
        return certificateWeight;
    }
}
