import { VoteSchema, VoteType } from '../types';
import PostDao from '../daos/PostDao';
import VoteDao from '../daos/VoteDao';
import { Contract } from 'ethers';

export default class VoteService {
    private postDao;
    private voteDao;
    private contract

    constructor(postDao: PostDao, voteDao: VoteDao, contract: Contract) {
        this.postDao = postDao;
        this.voteDao = voteDao;
        this.contract = contract;
    }

    // TODO: need to send tx to eth
    async sendVote(id: string, commitment: string, vote: VoteType): Promise<any> {
        const post = await this.postDao.getPostById(id);

        if (post == null || post == undefined) {
            throw new Error(`invalid post ${id}`);
        }

        const newVote: VoteSchema = {
            postId: id,
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
                throw new Error("invalid vote type");
        }

        await this.postDao.updateVotes(id, post.votes);

        return this.voteDao.sendVote(newVote);
    }
}