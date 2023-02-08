//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./IdentityToken.sol";

/**
 * @title Identity Manager - Digital Identity (Digital Certification)
 * @author Fábio Benjovengo
 *
 * @notice Manages the ID information stored as an NFT token.
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract SellingContract is IERC721Receiver {
    /// State variables
    address private tokenIdAddress;

    /// Contracts
    IdentityToken public identityToken;

    /**
     * Constructor Method
     *
     * @param _nftTokenAddress the address of the IdentityToken contract on the blockchain
     */
    constructor(address _nftTokenAddress) {
        tokenIdAddress = _nftTokenAddress;
    }

    // Receive confirmation for ERC-721 token - called upon a safe transfer
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function approveTransfer(uint256 _nftID) public {
        identityToken.approve(msg.sender, _nftID);
    }
}
