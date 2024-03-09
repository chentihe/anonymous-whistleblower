export class InternalError extends Error {
    httpStatusCode: number

    constructor(message?: string, httpStatusCode: number = 500) {
        super(message) // Pass the message to the Error constructor
        this.httpStatusCode = httpStatusCode
    }
}

// user related error
export const UserAlreadySignedUpError = new InternalError(
    'the user has already signed up.',
    400
)
// general error
export const InvalidProofError = new InternalError('invalid proof', 400);

// vote/post related error
export const UserAlreadyVotedError = new InternalError("the user is voted for the post", 400);
export const PostNotFoundError = new InternalError("post not found", 400);
export const InvalidVoteTypeError = new InternalError("invalid vote type", 400);