// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/governance/Governor.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "../../node_modules/@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

/**
 * @title The Governance Contract - Governance (Digital Certificate)
 * @author Fábio Benjovengo
 *
 * @notice Implementation of the governor contract, where the logic decisions are coded.
 *
 * @dev Use this contract only for tests! Do NOT send any real ether to this project!
 * @dev Contract created with the help of https://wizard.openzeppelin.com/#governor
 * @dev Beware of the compiled file size. Needs to use solc optimization to keep under the file size limit.
 * @custom:experimental This is an experimental contract.
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    /**
     * State variables
     */
    // Store active proposals
    struct ProposalDescription {
        string description;
        string functionToCall;
    }
    // @dev Proposals with status 0, 1, 4, or 5
    ProposalDescription[] private activeProposals;

    /**
     * @dev Initializes the contract with the following parameters:
     *
     * @param _token: interface for the ERC20Votes
     * @param _timelock: interface for the TimelockController
     *
     *
     * @notice [1] there is no minimal number of votes an account
     * must have to be able to create a proposal
     * @notice this contract is compatible with OpenZeppelin's
     * TimelockController. Allows multiple proposers and executors,
     * in addition to the Governor itself.
     */
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _quorumPercentage
    )
        Governor("DAO Banking")
        /**
         * @dev settings parameters:
         *
         * @param _votingDelay: voting delay in number of blocks (ex: 1 block)
         * @param _votingPeriod: voting period (ex: 1 week = (3600*24*7)/(12) for 12s per block)
         *                       time in seconds divided by the average time per block
         * @param 0 - proposal threshold (hard coded) [see notice [1] above]
         */
        GovernorSettings(
            _votingDelay, /* 1 block */
            _votingPeriod, // 45818, /* 1 week */
            0 // proposal threshold
        )
        GovernorVotes(_token)
        /// @param _quorum: quorum required for a proposal to pass (using 4%)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    function setProposal(
        string memory _functionToCall,
        address[] memory _targets,
        uint256[] memory _values,
        bytes[] memory _calldatas,
        string memory _description
    ) public {
        activeProposals.push(
            ProposalDescription(_description, _functionToCall)
        );
        propose(_targets, _values, _calldatas, _description);
    }

    /** @dev The following functions are overrides required by Solidity.
     *
     * @notice this overrides add the definitions set in the contructor
     * to the functions of the parent contract `Governor.sol`
     * @notice In inheritance, when a contract inherits from another
     * contract, it can override the functions defined in the parent contract.
     * The `super` keyword allows the child contract to call the
     * implementation of the parent contract's function.
     */

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, Governor)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
