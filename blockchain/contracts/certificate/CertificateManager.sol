//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./CertificateToken.sol";

/**
 * @title Certificate Manager - Digital Certificate
 * @author Fábio Benjovengo
 *
 * @notice Manages the information about the certificartes stored as an NFT token.
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract CertificateManager is IERC721Receiver {
    /// State variables
    address private certTokenAddress;

    string public DEBUG = "DEBUG";

    /// Contracts
    CertificateToken public certificateToken;

    /**
     * Events
     */
    event certCreation(uint256 _idSerialNumber);

    /**
     * Constructor Method
     *
     * @param _nftTokenAddress the address of the CertificateToken contract on the blockchain
     */
    constructor(address _nftTokenAddress) {
        certTokenAddress = _nftTokenAddress;
        certificateToken = CertificateToken(_nftTokenAddress);
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
     * Create a new certificate
     *
     * @param _tokenURI The address of the CertificateToken contract on the blockchain
     * @param _certificateHash The SHA-256 hash of the certificate info
     * @param _accountPublicKey The public key associated with the blockchain account
     *
     * @dev everyone can call this function for testing purposes
     * @dev in a production environment, it should not be possible for everyone to call this function
     */
    function createNewCertificate(
        string memory _tokenURI,
        bytes32 _certificateHash,
        string memory _accountPublicKey
    ) public {
        /// Require that the certificate URI is not blank
        require(
            (keccak256(abi.encodePacked((_tokenURI))) !=
                keccak256(abi.encodePacked(("")))),
            "ERROR! Invalid token URI. Token URI must contain data."
        );

        /// Issue new ID - Mint NFT
        uint256 newIdSerialNumber = certificateToken.mint(
            msg.sender,
            _tokenURI,
            _certificateHash,
            _accountPublicKey
        );

        /// Emit event with the ID serial number
        emit certCreation(newIdSerialNumber);
    }
}
