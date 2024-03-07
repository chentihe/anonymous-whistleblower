import { ethers } from 'ethers';
import PostDao from '../daos/PostDao';

export default class PostService {
    private postDao;

    constructor(postDao: PostDao) {
        this.postDao = postDao;
    }

    // TODO: need to send tx to eth
    async createPost(commitment: bigint, title: string, content: string): Promise<any> {
        const postId = BigInt(ethers.utils.solidityKeccak256(["uint", "string"], [commitment, title]));
        const post = {
            id: postId.toString(),
            title: title,
            content: content,
            author: commitment.toString(),
        }

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