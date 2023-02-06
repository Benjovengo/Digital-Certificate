//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/// @dev OpenZeppelin - imports for NFT (ERC-721 token)
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Identity NFT - Digital Identity (Digital Certification)
 * @author Fábio Benjovengo
 *
 * @notice NFT token to store identity information.
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract IdentityToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    /** @notice State Variables */

    /// @dev Counter to create the unique serial number for each identity
    using Counters for Counters.Counter;
    Counters.Counter private serialNumberId; // personal ID number

    /// @dev Mappings - values for each individual
    mapping(address => uint256) private uniqueSerialNumber; // the serial number for each identity
    mapping(uint256 => bytes32) private verificationHash; // to verify that the information is valid
    mapping(uint256 => bytes32) private publicKey; // used to encrypt message to the user
    mapping(uint256 => bool) private isActive; // ideintity activity = is person alive

    /** @notice Constructor method
     *
     * @dev Hard coded token name and symbol
     */
    constructor() ERC721("Digital Blockchain Identity", "DBI") {}

    /** @notice Mint new identity
     *
     * @param _identityURI Path to the JSON file containing the personal information
     * @param _blockchainAddress Address of the owner of the idendity
     * @param _identityHash The hash of the JSON file with submitted information
     * @param _accountPublicKey The public key associated with the blockchain account
     *
     * @return newIdSerialNumber The unique serial number of the account
     */
    function mint(
        string memory _identityURI,
        address _blockchainAddress,
        bytes32 _identityHash,
        bytes32 _accountPublicKey
    ) public onlyOwner returns (uint256) {
        serialNumberId.increment();
        uint256 newIdSerialNumber = serialNumberId.current();
        _mint(_blockchainAddress, newIdSerialNumber);
        _setTokenURI(newIdSerialNumber, _identityURI);

        /// @notice add identity data for operational functions
        uniqueSerialNumber[_blockchainAddress] = newIdSerialNumber;
        verificationHash[newIdSerialNumber] = _identityHash;
        publicKey[newIdSerialNumber] = _accountPublicKey;
        isActive[newIdSerialNumber] = true;

        return newIdSerialNumber;
    }

    /** @notice Get the hash
     *
     * @param _accountAddress The blockchain address of the identity
     * @return publicKey A public key to encrypt info for a specific account
     */
    function getPublicKey(address _accountAddress)
        public
        view
        returns (bytes32)
    {
        return publicKey[uniqueSerialNumber[_accountAddress]];
    }

    /** @notice Set the identity as true:active, or false:inactive
     *
     * @param _accountAddress The address of the account to set the activity
     * @param _activityStatus The activity status for that identity
     */
    function setActive(address _accountAddress, bool _activityStatus)
        public
        onlyOwner
    {
        isActive[uniqueSerialNumber[_accountAddress]] = _activityStatus;
    }

    /** @notice Burn the identity */
    function burnIdentity(address _accountAddress) public onlyOwner {
        _burn(uniqueSerialNumber[_accountAddress]);
    }

    /**
     * @notice The following functions are overrides required by Solidity.
     *
     * @dev Created by OpenZeppelin Wizard at https://docs.openzeppelin.com/contracts/4.x/wizard
     */

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
        return super.tokenURI(tokenId);
    }
}
