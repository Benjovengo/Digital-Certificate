//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./IdentityToken.sol";

/**
 * @title Identity Manager - Digital Identity (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * @notice Manages the ID information stored as an NFT token.
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract IdentityManager is IERC721Receiver {
    /// State variables
    address private tokenIdAddress;

    /// Contracts
    IdentityToken public identityToken;

    /**
     * Events
     */
    event idCreation(uint256 _idSerialNumber);

    /**
     * Constructor Method
     *
     * @param _nftTokenAddress the address of the IdentityToken contract on the blockchain
     */
    constructor(address _nftTokenAddress) {
        tokenIdAddress = _nftTokenAddress;
        identityToken = IdentityToken(_nftTokenAddress);
    }

    /**
     * Receive confirmation for ERC-721 token - called upon a safe transfer
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * Create a new ID
     *
     * @param _tokenURI The address of the IdentityToken contract on the blockchain
     * @param _accountPublicKey The public key associated with the blockchain account
     *
     * @dev everyone can call this function for testing purposes
     * @dev in a production environment, it should not be possible for everyone to call this function
     */
    function createNewId(
        string memory _tokenURI,
        string memory _accountPublicKey
    ) public {
        /// Require that the identity URI is not blank
        require(
            (keccak256(abi.encodePacked((_tokenURI))) !=
                keccak256(abi.encodePacked(("")))),
            "ERROR! Invalid token URI. Token URI must contain data."
        );

        /// Store the serial number for the minted identity NFT
        uint256 currentSerialNumber = identityToken.getSerialNumber(msg.sender);

        /// Issue new ID - Mint NFT
        uint256 newIdSerialNumber = identityToken.mint(
            msg.sender,
            _tokenURI,
            _accountPublicKey
        );

        /// Burn old ID
        if (currentSerialNumber != 0) {
            identityToken.burnIdentity(msg.sender);
        }

        /// Emit event with the ID serial number
        emit idCreation(newIdSerialNumber);
    }
}
