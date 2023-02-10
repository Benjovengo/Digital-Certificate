//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/// @dev OpenZeppelin - imports for NFT (ERC-721 token)
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Certifications NFT - Digital Identity (Digital Certification)
 * @author Fábio Benjovengo
 *
 * @notice NFT token to store the information for a certification.
 *
 * @custom:security Use this contract only for tests! Do NOT store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract CertificationsToken is
    ERC721,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable
{
    /** @notice State Variables */

    /// @dev Counter to create the unique serial number for each certification
    using Counters for Counters.Counter;
    Counters.Counter private serialNumberId; // personal ID number

    /// @dev Mappings - values for each identity
    mapping(address => uint256) private uniqueSerialNumber; // the serial number for each identity
    mapping(uint256 => string) private publicKey; // used to encrypt message to the user
    mapping(uint256 => bool) private isActive; // ideintity activity = is person alive

    /// @dev block lock parameters
    uint256 private blockHeight = 0; // used in conjunction with the blockLockStart
    mapping(uint256 => uint256) private blockLockStart; // to require a certain block height to begin using the identity

    /** @notice Constructor method
     *
     * @dev Hard coded token name and symbol
     */
    constructor() ERC721("Digital Blockchain Identity", "DBI") {}

    /** @notice Mint new identity
     *
     * @param _blockchainAddress Address of the owner of the idendity
     * @param _identityURI Path to the JSON file containing the personal information
     * @param _accountPublicKey The public key associated with the blockchain account
     * @return newIdSerialNumber The unique serial number of the account
     */
    function mint(
        address _blockchainAddress,
        string memory _identityURI,
        string memory _accountPublicKey
    ) public onlyOwner returns (uint256) {
        /// @notice Add a new identity and increment IDs
        serialNumberId.increment();
        uint256 newIdSerialNumber = serialNumberId.current();
        _mint(_blockchainAddress, newIdSerialNumber);
        _setTokenURI(newIdSerialNumber, _identityURI);

        /// @notice add identity data for operational functions
        uniqueSerialNumber[_blockchainAddress] = newIdSerialNumber;
        publicKey[newIdSerialNumber] = _accountPublicKey;
        isActive[newIdSerialNumber] = true;

        // @dev set the minimum block number to be a valid identity
        blockLockStart[newIdSerialNumber] = block.number + blockHeight;

        return newIdSerialNumber;
    }

    /** @notice Get the tokenURI serial number
     *
     * @param _accountAddress The blockchain address of the identity
     * @return serialNumber The serial number of the token associated with the account
     */
    function getSerialNumber(address _accountAddress)
        public
        view
        returns (uint256)
    {
        return uniqueSerialNumber[_accountAddress];
    }

    /** @notice Get the hash
     *
     * @param _accountAddress The blockchain address of the identity
     * @return publicKey A public key to encrypt info for a specific account
     */
    function getPublicKey(address _accountAddress)
        public
        view
        returns (string memory)
    {
        return publicKey[uniqueSerialNumber[_accountAddress]];
    }

    /** @notice Set the identity status for the idendity
     *
     * @param _accountAddress The address of the account to set the activity
     * @param _activityStatus The activity status for that identity: true:active, or false:inactive
     */
    function setActive(address _accountAddress, bool _activityStatus)
        public
        onlyOwner
    {
        isActive[uniqueSerialNumber[_accountAddress]] = _activityStatus;
    }

    /** @notice Get the identity status for the idendity
     *
     * @param _accountAddress The address of the account to set the activity
     * @return isActive The activity status for that identity: true:active, or false:inactive
     */
    function getActive(address _accountAddress) public view returns (bool) {
        return isActive[uniqueSerialNumber[_accountAddress]];
    }

    /** @notice Burn the identity
     *
     * @param _accountAddress The address of the identity to be burnt
     */
    function burnIdentity(address _accountAddress) public onlyOwner {
        _burn(uniqueSerialNumber[_accountAddress]);
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
