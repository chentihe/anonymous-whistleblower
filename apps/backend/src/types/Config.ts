import PostService from "../services/PostService"
import VoteService from "../services/VoteService"

export type Config = {
    postService: PostService,
    voteService: VoteService,
}