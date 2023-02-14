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
 * @notice Total score: the weighted sum of the certificates and its corresponding GPAs
 * The weights of the certificates are based on the level of the certificate
 * The GPAs are also weighted
 * The total score entry is: <weight><certificate_level>*<GPA>,
 * where the weight is controlled by the governance
 *
 * @dev Use this contract only for tests! Do NOT send any real ether to this project!
 * @custom:experimental This is an experimental contract.
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract ExpertiseClusters is Ownable {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
