// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @notice Owned by the Timelock contract.
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GPA Clusters - Governance (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * @notice Define the GPA grades to be in one of three levels: novice, intermediate, or expert.
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
