//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./CertificateToken.sol";
import "../governance/VotingToken.sol";

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
    /// @notice Each certificate is assigned to a blockchain address and
    ///         each blockchain address may have several certificates.
    /// The relevant information of the certificate for calculating the
    /// score are the level of the certificate and the corresponding GPA.
    /// @dev mapping from address to a mapping from certificate_index to
    ///      its [level, gpa] (array)
    mapping(address => mapping(uint256 => uint16[2]))
        private certificateDetails;
    /// Save the public key of an account
    /// @dev Used to encrypt message to the user
    mapping(address => bytes) private publicKey;
    /// Multiplier of the GPA for different certificate levels
    uint8[10] private degreeMultiplier = [
        10, // Bachelor of Arts (BA)
        10, // Bachelor of Science (BSc)
        15, // Master of Arts (MA)
        15, // Master of Science (MSc)
        30, // Doctor of Medicine (MD)
        30, // Doctor of Dental Medicine (DMD)
        30, // Doctor of Veterinary Medicine (DVM)
        30, // Doctor of Juridical Science (JSD)
        30, // Doctor of Philosophy (PhD)
        40 // Postdoctoral Fellow
    ];

    /// Contracts
    CertificateToken public certificateToken;
    /**
     * Access the VotingToken contract
     *
     * @dev Required to transfer the tokens to the accounts on adding the certificates.
     */
    VotingToken public votingToken;

    /**
     * Events
     */
    event certCreation(uint256 _idSerialNumber);

    /**
     * Constructor Method
     *
     * @param _nftTokenAddress the address of the CertificateToken contract on the blockchain
     */
    constructor(address _nftTokenAddress, address _votingTokenAddress) {
        certTokenAddress = _nftTokenAddress;
        certificateToken = CertificateToken(_nftTokenAddress);
        votingToken = VotingToken(_votingTokenAddress);
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
     * @param _level The level of the certificate
     * @param _gpa 100*GPA the actual obtained in a given certification
     * @param _tokenURI The address of the CertificateToken contract on the blockchain
     * @param _certificateHash The SHA-256 hash of the certificate info
     * @param _accountPublicKey The public key associated with the blockchain account
     *
     * @dev Use _gpa = 0 to denote that there's no grade associated with that certificate
     * @dev Use 100*GPA (for GPA with two decimals) to avoid floating point numbers
     * @dev everyone can call this function for testing purposes
     * @dev in a production environment, it should not be possible for everyone to call this function
     */
    function createNewCertificate(
        address _blockchainAddress,
        uint16 _level,
        uint16 _gpa,
        string memory _tokenURI,
        bytes32 _certificateHash,
        bytes memory _accountPublicKey
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
            _certificateHash
        );
        /// Update the Ids tracked
        if (numberOfCertificates[_blockchainAddress] == 0) {
            issuedAddresses[idSerialNumber] = _blockchainAddress;
            idSerialNumber++;
            publicKey[_blockchainAddress] = _accountPublicKey;
        }
        /// Update certificate list
        certificateDetails[_blockchainAddress][
            numberOfCertificates[_blockchainAddress]
        ] = [_level, _gpa];
        /// Update the number of certificates
        numberOfCertificates[_blockchainAddress]++;
        /// Set the number of the voting tokens to be transferred
        uint16 votingPower = degreeMultiplier[_level] * _gpa;
        /// Approve the transfer
        votingToken.approve(address(this), votingPower);
        /// Transfer Voting Tokens
        votingToken.transferFrom(
            address(this),
            _blockchainAddress,
            votingPower
        );
        /// Emit event with the ID serial number
        emit certCreation(newCertSerialNumber);
    }

    /**
     * Returns the total number of addresses that owns at least one certificate.
     *
     * @return idSerialNumber The total number of addresses with
     *         at least one issued certificate (uint256 value)
     */
    function getNumberOfAddresses() external view returns (uint256) {
        return idSerialNumber;
    }

    /**
     * Returns the total number of certificates owned by an account.
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

    /** @notice Get the associated publicKey
     *
     * @param _accountAddress The blockchain address of the identity
     * @return publicKey A public key to encrypt info for a specific account
     */
    function getPublicKey(address _accountAddress)
        public
        view
        returns (bytes memory)
    {
        return publicKey[_accountAddress];
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

    /**
     * Approve a certain amount of tokens to be transferred from
     * the Governor contract
     *
     * @dev The approval is required before transferring the
     *      tokens on registering a new certificate.
     */
    function approveTransfer(uint256 _amount) public {
        votingToken.approve(address(this), _amount);
    }

    /**
     * Give voting power to account
     *
     * @dev Transfer the voting tokens to an account.
     */
    function addVotingPower(address _blockchainAddress, uint256 _amount)
        public
    {
        votingToken.transferFrom(address(this), _blockchainAddress, _amount);
    }
}
