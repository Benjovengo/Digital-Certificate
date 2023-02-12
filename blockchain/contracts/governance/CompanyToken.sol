// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Company Token - Governance (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * @notice NFT token used to allow an account to apply for a job at the company
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract CompanyToken is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("CompanyToken", "CPT") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
