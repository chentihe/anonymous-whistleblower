import IMTService from "../services/IMTService"
import PostService from "../services/PostService"
import VoteService from "../services/VoteService"
import UserService from "../services/UserService"

export type Config = {
    postService: PostService,
    voteService: VoteService,
    userService: UserService,
    imtService: IMTService,
}