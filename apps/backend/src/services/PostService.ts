import { PrismaClient } from '@prisma/client'
import { VoteType } from '../types';

export default class PostService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createPost(commitment: bigint, title: string, content: string): Promise<any> {
        return this.prisma.post.create({
            author: commitment.toString(),
            title: title,
            content: content,
        });
    }

    // orderBy desc createdAt
    async getPosts() {
        return this.prisma.post.findMany();
    }

    async getPostsByCommitment(commitment: bigint) {
        return this.prisma.post.findMany({
            where: {
                commitment: commitment
            }
        });
    }

    async sendVote(id: string, vote: VoteType): Promise<any> {
        // TODO: verify member voted or not

        const post = this.prisma.post.findUnique({
            where: {
                id: id
            }
        });

        switch (vote) {
            case VoteType.UpVote:
                post.votes += 1;
                break;
            case VoteType.DownVote:
                post.votes -= 1;
                break;
            default:
                throw new Error("invalid vote type");
        }
        
        return this.prisma.post.update(post);
    }
}