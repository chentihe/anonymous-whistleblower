export enum VoteType {
    UpVote,
    DownVote,
}

export type VoteSchema = {
    postId: string,
    voter: string,
    result: number | null,
}