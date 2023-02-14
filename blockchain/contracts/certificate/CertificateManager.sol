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
    /// Stores the total number of certificates an address has
    /// @dev Used to track the certificateDetails for all certificates
    ///      issued to a particular blockchain address
    mapping(address => uint256) private numberOfCertificates;
    /// Stores the accounts that have certificate(s) issued to them
    /// @dev the mapping considers an ID serial number for the
    ///      addresses in the form of an uint256
    uint256 private idSerialNumber; // total number of addresses that have at least one certificate
    mapping(uint256 => address) private issuedAddresses;

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
     * @param _blockchainAddress The address of the account on the blockchain
     * @param _tokenURI The address of the CertificateToken contract on the blockchain
     * @param _certificateHash The SHA-256 hash of the certificate info
     * @param _accountPublicKey The public key associated with the blockchain account
     *
     * @dev everyone can call this function for testing purposes
     * @dev in a production environment, it should not be possible for everyone to call this function
     */
    function createNewCertificate(
        address _blockchainAddress,
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
        uint256 newCertSerialNumber = certificateToken.mint(
            _blockchainAddress,
            _tokenURI,
            _certificateHash,
            _accountPublicKey
        );
        /// Update the Ids tracked
        if (numberOfCertificates[_blockchainAddress] == 0) {
            issuedAddresses[idSerialNumber] = _blockchainAddress;
            idSerialNumber++;
        }
        /// Update the number of certificates
        numberOfCertificates[_blockchainAddress]++;
        /// Emit event with the ID serial number
        emit certCreation(newCertSerialNumber);
    }

    /**
     * Reads the total number of certificates owned by an account.
     *
     * @param _blockchainAddress The address of the account on the
     *        blockchain
     * @return numberOfCertificates[address] The number of certificates
     *         owned by an account (uint256 value)
     */
    function getNumberOfCertificates(address _blockchainAddress)
        external
        view
        returns (uint256)
    {
        return numberOfCertificates[_blockchainAddress];
    }

    /**
     * Set the transaction hash - to get the address on Etherscan
     *
     * @param _serialNumber The serial number of the certificate
     * @param _transactionHash The hash of the transaction
     */
    function setHash(uint256 _serialNumber, bytes32 _transactionHash) public {
        certificateToken.setTransactionHash(_serialNumber, _transactionHash);
    }
}
