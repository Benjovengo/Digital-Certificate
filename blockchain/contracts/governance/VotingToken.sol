// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @title ERC-20 Voting Token - Governance (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * @notice This contract implements the voting token standard.
 *
 * @dev Use this contract only for tests! Do NOT send any real ether to this project!
 * @custom:experimental This is an experimental contract.
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract Token is ERC20Votes {
    /**
     * @dev Initializes the contract with the following parameters:
     *
     * @param _name: name of the voting token
     * @param _symbol: the symbol for the token
     * @param _initialSupply: the initial supply of tokens
     *
     * @notice ERC20Permit standard is used to build applications that
     * require conditional transfers of tokens, such as decentralized
     * exchanges or governance systems
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        _mint(msg.sender, _initialSupply);
    }

    /// @dev Move voting power when tokens are transferred.
    /// @notice override required by Solidity
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    /// @dev Snapshots the totalSupply after it has been increased.
    /// @notice override required by Solidity
    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    /// @dev Snapshots the totalSupply after it has been decreased.
    /// @notice override required by Solidity
    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }
}
