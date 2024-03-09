import { Contract, ethers } from 'ethers';
import PostDao from '../daos/PostDao';
import { IMTMerkleProof } from '@zk-kit/imt';
import IMTService from './IMTService';
import { InvalidProofError } from '../types';

export default class PostService {
    private postDao: PostDao;
    private contract: Contract;
    private imtService: IMTService;

    constructor(postDao: PostDao, contract: Contract, imtService: IMTService) {
        this.postDao = postDao;
        this.contract = contract;
        this.imtService = imtService;
    }

    async createPost(proof: IMTMerkleProof, title: string, content: string): Promise<any> {
        if (!this.imtService.verifyProof(proof)) {
            throw InvalidProofError;
        };
        
        const commitment = proof.leaf;
        const postId = BigInt(ethers.utils.solidityKeccak256(["uint", "string"], [commitment, title]));
        const post = {
            id: postId.toString(),
            title: title,
            content: content,
            author: commitment.toString(),
        };

        const tx = await this.contract.sendPost({
            leaf: proof.leaf,
            proofSiblings: proof.siblings,
            proofPathIndices: proof.pathIndices,
        }, title, content);
        await tx.wait();

        return this.postDao.createPost(post);
    }

    // orderBy desc createdAt
    async getPosts(offset: number) {
        return this.postDao.getPosts(offset);
    }

    async getPostsByAuthor(commitment: string, offset: number) {
        return this.postDao.getPostsByCommitment(commitment, offset);
    }
}