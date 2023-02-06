//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/// @dev OpenZeppelin - imports for NFT (ERC-721 token)
import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
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
contract IdentityToken is ERC721URIStorage, Ownable {
    /** @notice State Variables */
    using Counters for Counters.Counter;
    Counters.Counter private serialNumberId; // personal ID number

    /** @notice Constructor method
     *
     * @dev Hard coded token name and symbol
     */
    constructor() ERC721("Digital Blockchain Identity", "DBI") {}

    /** @notice Mint new identity
     *
     * @param _identityURI: path to the JSON file containing the personal information
     */
    function mint(string memory _identityURI)
        public
        onlyOwner
        returns (uint256)
    {
        serialNumberId.increment();
        uint256 newIdSerialNumber = serialNumberId.current();
        _mint(msg.sender, newIdSerialNumber);
        _setTokenURI(newIdSerialNumber, _identityURI);

        return newIdSerialNumber;
    }

    /** @notice Total number of identities issued */
    function totalIdentities() public view returns (uint256) {
        return serialNumberId.current();
    }
}
