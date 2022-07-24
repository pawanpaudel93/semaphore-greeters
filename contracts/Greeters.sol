// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";

contract Greeters is SemaphoreCore {
    // A new greeting is published every time a user's proof is validated.
    event NewGreeting(bytes32 greeting);

    // Greeters are identified by the root of their Merkle tree.
    uint256 public greeters;

    // The external verifier used to verify Semaphore proofs.
    IVerifier public verifier;

    constructor(uint256 _greeters, address _verifier) {
        greeters = _greeters;
        verifier = IVerifier(_verifier);
    }

    // Only users who create valid proofs can greet.
    // The external nullifier is the root of the Merkle tree.
    function greet(
        bytes32 _greeting,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) external {
        _verifyProof(
            _greeting,
            greeters,
            _nullifierHash,
            greeters,
            _proof,
            verifier
        );

        // Prevent double-greeting (nullifierHash = hash(root + identityNullifier)).
        // Every user can greet once.
        _saveNullifierHash(_nullifierHash);
        emit NewGreeting(_greeting);
    }
}
