import { InvalidProofError, InvalidVoteTypeError, PostNotFoundError, VoteSchema, VoteType } from '../types';
import PostDao from '../daos/PostDao';
import VoteDao from '../daos/VoteDao';
import { Contract } from 'ethers';
import IMTService from './IMTService';
import { IMTMerkleProof } from '@zk-kit/imt';

export default class VoteService {
    private postDao: PostDao;
    private voteDao: VoteDao;
    private contract: Contract;
    private imtService: IMTService;

    constructor(postDao: PostDao, voteDao: VoteDao, contract: Contract, imtService: IMTService) {
        this.postDao = postDao;
        this.voteDao = voteDao;
        this.contract = contract;
        this.imtService = imtService;
    }

    async sendVote(proof: IMTMerkleProof, postId: string, commitment: string, vote: VoteType): Promise<any> {
        if (!this.imtService.verifyProof(proof)) {
            throw InvalidProofError;
        }

        const post = await this.postDao.getPostById(postId);
        if (post == null || post == undefined) {
            throw PostNotFoundError;
        }

        const newVote: VoteSchema = {
            postId: postId,
            voter: commitment,
            result: null,
        };

        switch (vote) {
            case VoteType.UpVote:
                post.votes += 1;
                newVote.result = 1;
                break;
            case VoteType.DownVote:
                post.votes -= 1;
                newVote.result = -1;
                break;
            default:
                throw InvalidVoteTypeError;
        }

        const tx = await this.contract.sendVote({
            leaf: proof.leaf,
            proofSiblings: proof.siblings,
            proofPathIndices: proof.pathIndices,
        }, postId);
        await tx.wait();

        await this.postDao.updateVotes(postId, post.votes);
        return this.voteDao.sendVote(newVote);
    }
}