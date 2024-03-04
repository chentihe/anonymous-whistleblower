//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { InternalBinaryIMT, BinaryIMTData } from "@zk-kit/imt.sol/internal/InternalBinaryIMT.sol";

contract AnonymousWhistleblower {
    using InternalBinaryIMT for BinaryIMTData;

    struct IMTProof {
        uint256 leaf;
        uint256[] proofSiblings;
        uint8[] proofPathIndices;
    }

    error InvalidMember(uint256 leaf);
    error AlreadyVoted();

    event Post();
    event Vote();

    BinaryIMTData group;
    // key: post id, value: votes
    mapping (uint256 => uint256) votesByPost;
    // key: commitment => key: post id, value: voted or not
    mapping (uint256 => mapping(uint256 => bool)) membersVoted;

    constructor(uint256 depth) {
        group._initWithDefaultZeroes(depth);
    }

    function signup(uint256 identity) external {
        group._insert(identity);
    }

    // TODO: record post and postId by emitting Post event
    function sendPost(IMTProof calldata proof, string memory post) external {
        if (!group._verify(proof.leaf, proof.proofSiblings, proof.proofPathIndices)) {
            revert InvalidMember(proof);
        }

        uint256 postId = uint256(keccak256(abi.encodePacked(post)));
    }

    // TODO: update membersVoted mapping & votesByPost
    function sendVote(IMTProof calldata proof, uint256 post, bool vote) external {
        if (!group._verify(proof.leaf, proof.proofSiblings, proof.proofPathIndices)) {
            revert InvalidMember(proof.leaf);
        }

        if (!membersVoted[proof.leaf][post]) {
            revert AlreadyVoted();
        }
    }
}
