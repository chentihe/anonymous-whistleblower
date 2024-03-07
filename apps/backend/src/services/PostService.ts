import { Contract, ethers } from 'ethers';
import PostDao from '../daos/PostDao';
import { IMTMerkleProof } from '@zk-kit/imt';
import IMTService from './IMTService';

export default class PostService {
    private postDao;
    private contract;
    private imtService;

    constructor(postDao: PostDao, contract: Contract, imtService: IMTService) {
        this.postDao = postDao;
        this.contract = contract;
        this.imtService = imtService;
    }

    // TODO: need to send tx to eth
    async createPost(proof: IMTMerkleProof, commitment: bigint, title: string, content: string): Promise<any> {
        if (!this.imtService.verifyProof(proof)) {
            throw new Error("invalid proof");
        };

        const postId = BigInt(ethers.utils.solidityKeccak256(["uint", "string"], [commitment, title]));
        const post = {
            id: postId.toString(),
            title: title,
            content: content,
            author: commitment.toString(),
        };

        await this.contract.sendPost({
            leaf: proof.leaf,
            proofSiblings: proof.siblings,
            proofPathIndices: proof.pathIndices,
        }, title, content);

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