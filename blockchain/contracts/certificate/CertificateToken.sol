//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/// @dev OpenZeppelin - imports for NFT (ERC-721 token)
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Certificates NFT - Digital Identity (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * @notice NFT token to store the information for a certificate/diploma.
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract CertificateToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    /** @notice State Variables */

    /// @dev Counter to create the unique serial number for each certificate
    using Counters for Counters.Counter;
    Counters.Counter private certSerialNumber; // certificate number

    /// @dev Mappings - values for each identity
    mapping(uint256 => bytes32) private certHash; // hash of the registered certificate (for verification purposes)
    mapping(uint256 => string) private publicKey; // used to encrypt message to the user
    mapping(uint256 => bool) private finished; // false:in progress; true: finished

    ///   SerialNumber  [cert #]
    mapping(address => uint256[]) private certificatesOwned; // array with the serial numbers of the certificates owned by an account
    mapping(uint256 => uint256) private indexOfOwnersList; /* index of a certificate inside the owner's list of certificates
                                                              use it to get the array index of a certificate based on serial number
                                                              - easier way to find a certificate */

    /// @dev block lock parameters
    uint256 private blockHeight = 0; // used in conjunction with the blockLockStart
    mapping(uint256 => uint256) private blockLockStart; // to require a certain block height to begin using the identity

    /** @notice Constructor method
     *
     * @dev Hard coded token name and symbol
     */
    constructor() ERC721("Blockchain Certificate and Diploma", "BCD") {}

    /** @notice Mint new certificate/diploma
     *
     * @param _blockchainAddress Address of the owner of the certificate
     * @param _certificateURI Path to the JSON file containing the personal information
     * @param _certificateHash SHA-256 hash of the certificate data
     * @param _accountPublicKey The public key associated with the blockchain account
     * @return newIdSerialNumber The unique serial number of the account
     */
    function mint(
        address _blockchainAddress,
        string memory _certificateURI,
        bytes32 _certificateHash,
        string memory _accountPublicKey
    ) public onlyOwner returns (uint256) {
        /// @notice Add a new identity and increment IDs
        certSerialNumber.increment();
        uint256 newIdSerialNumber = certSerialNumber.current();
        _mint(_blockchainAddress, newIdSerialNumber);
        _setTokenURI(newIdSerialNumber, _certificateURI);

        /// @notice add certificate data for operational functions
        certHash[newIdSerialNumber] = _certificateHash;
        publicKey[newIdSerialNumber] = _accountPublicKey;
        finished[newIdSerialNumber] = true;

        /// @notice Add certificate serial number to owner's address list
        certificatesOwned[_blockchainAddress].push(newIdSerialNumber);
        indexOfOwnersList[newIdSerialNumber] =
            certificatesOwned[_blockchainAddress].length -
            1; // starts in zero

        // @dev set the minimum block number to be a valid certificate
        blockLockStart[newIdSerialNumber] = block.number + blockHeight;

        return newIdSerialNumber;
    }

    /** @notice Get the tokenURI serial number
     *
     * @param _accountAddress The blockchain address of the identity
     * @param _index Index of the certificate in owner's list
     * @return serialNumber The serial number of the token associated with the account
     */
    function getSerialNumber(address _accountAddress, uint256 _index)
        public
        view
        returns (uint256)
    {
        return certificatesOwned[_accountAddress][_index];
    }

    /** @notice Get the associated publicKey
     *
     * @param _accountAddress The blockchain address of the identity
     * @param _index Index of the certificate in owner's list
     * @return publicKey A public key to encrypt info for a specific account
     */
    function getPublicKey(address _accountAddress, uint256 _index)
        public
        view
        returns (string memory)
    {
        return publicKey[certificatesOwned[_accountAddress][_index]];
    }

    /** @notice Set the status for the certificate
     *
     * @param _accountAddress The address of the account to set the activity
     * @param _index Index of the certificate in owner's list
     * @param _activityStatus The activity status for that identity: true:active, or false:inactive
     */
    function setStatus(
        address _accountAddress,
        uint256 _index,
        bool _activityStatus
    ) public onlyOwner {
        finished[certificatesOwned[_accountAddress][_index]] = _activityStatus;
    }

    /** @notice Get the status for the certificate
     *
     * @param _accountAddress The address of the account to set the activity
     * @param _index Index of the certificate in owner's list
     * @return finished The activity status for that identity: true:active, or false:inactive
     */
    function getStatus(address _accountAddress, uint256 _index)
        public
        view
        returns (bool)
    {
        return finished[certificatesOwned[_accountAddress][_index]];
    }

    /** @notice Burn the identity
     *
     * @param _accountAddress The address of the identity to be burnt
     * @param _index Index of the certificate in owner's list
     */
    function burnCertificate(address _accountAddress, uint256 _index)
        public
        onlyOwner
    {
        certificatesOwned[_accountAddress][_index] = 0;
        _burn(certificatesOwned[_accountAddress][_index]);
    }

    /** @notice List of the certificates owned by an account
     *
     * @param _accountAddress Address of the owner of the certificates
     * @return certificatesOwned[_accountAddress] Array of the serial numbers of the owned certificates
     */
    function listCertificates(address _accountAddress)
        public
        view
        returns (uint256[] memory)
    {
        return certificatesOwned[_accountAddress];
    }

    /** @notice Get the hash of a certification
     *
     * @param _serialNumber The serial number of the certification
     */
    function getHash(uint256 _serialNumber) public view returns (bytes32) {
        return certHash[_serialNumber];
    }

    /**
     * @notice The following functions are overrides required by Solidity.
     *
     * @dev Created by OpenZeppelin Wizard at https://docs.openzeppelin.com/contracts/4.x/wizard
     */

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721) {
        require(
            msg.sender == this.owner(),
            "Only the contract owner can transfer identity tokens."
        );
        super._transfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        // @dev set the minimum block number to retrieve the identity data
        require(
            block.number >= blockLockStart[tokenId],
            "ERROR: minimum block height not achieved!"
        );
        return super.tokenURI(tokenId);
    }
}
