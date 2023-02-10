//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./CertificationToken.sol";

/**
 * @title Certification Manager - Digital Certification
 * @author Fábio Benjovengo
 *
 * @notice Manages the information about the certificartes stored as an NFT token.
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract CertificationManager is IERC721Receiver {
    /// State variables
    address private tokenIdAddress;

    /// Contracts
    CertificationToken public certificationToken;

    /**
     * Events
     */
    event idCreation(uint256 _idSerialNumber);

    /**
     * Constructor Method
     *
     * @param _nftTokenAddress the address of the CertificationToken contract on the blockchain
     */
    constructor(address _nftTokenAddress) {
        tokenIdAddress = _nftTokenAddress;
        certificationToken = CertificationToken(_nftTokenAddress);
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
     * Create a new certification
     *
     * @param _tokenURI The address of the CertificationToken contract on the blockchain
     * @param _certificationHash The SHA-256 hash of the certificate info
     * @param _accountPublicKey The public key associated with the blockchain ac
     *
     * @dev everyone can call this function for testing purposes
     * @dev in a production environment, it should not be possible for everyone to call this function
     */
    function createNewCertification(
        string memory _tokenURI,
        bytes32 _certificationHash,
        string memory _accountPublicKey
    ) public {
        /// Require that the certification URI is not blank
        require(
            (keccak256(abi.encodePacked((_tokenURI))) !=
                keccak256(abi.encodePacked(("")))),
            "ERROR! Invalid token URI. Token URI must contain data."
        );

        /// Store the serial number for the minted certification NFT
        uint256 currentSerialNumber = certificationToken.getSerialNumber(
            msg.sender
        );

        /// Issue new ID - Mint NFT
        uint256 newIdSerialNumber = certificationToken.mint(
            msg.sender,
            _tokenURI,
            _certificationHash,
            _accountPublicKey
        );

        /// Burn old ID
        if (currentSerialNumber != 0) {
            certificationToken.burnCertification(msg.sender);
        }

        /// Emit event with the ID serial number
        emit idCreation(newIdSerialNumber);
    }
}