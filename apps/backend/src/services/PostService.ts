import { PrismaClient } from '@prisma/client'
import { VoteType } from '../types';
import { ethers } from 'ethers';

export default class PostService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    // TODO: need to send tx to eth
    async createPost(commitment: bigint, title: string, content: string): Promise<any> {
        const postId = BigInt(ethers.solidityPackedKeccak256(["uint", "string"], [commitment, title]));
        return this.prisma.post.create({
            data: {
                postId: postId.toString(),
                author: commitment.toString(),
                title: title,
                content: content,
            }
        });
    }

    // orderBy desc createdAt
    async getPosts() {
        return this.prisma.post.findMany();
    }

    async getPostsByCommitment(commitment: bigint) {
        return this.prisma.post.findMany({
            where: {
                author: commitment.toString()
            }
        });
    }

    // TODO: need to send tx to eth
    async sendVote(id: string, commitment: bigint, vote: VoteType): Promise<any> {
        const post = await this.prisma.post.findFirstOrThrow({
            where: {
                postId: id
            }
        });

        if (post.voters.includes(commitment.toString())) {
            throw new Error("the user is voted for the post");
        }

        switch (vote) {
            case VoteType.UpVote:
                post.votes += 1;
                post.voters.push(commitment.toString());
                break;
            case VoteType.DownVote:
                post.votes -= 1;
                post.voters.push(commitment.toString());
                break;
            default:
                throw new Error("invalid vote type");
        }
        
        return this.prisma.post.update({
            where: {
                id: post.id,
            },
            data: post,
        });
    }
}