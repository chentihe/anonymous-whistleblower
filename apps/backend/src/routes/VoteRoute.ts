import { Express } from 'express'
import { Config, VoteType } from '../types'
import { errorHandler } from '../middlewares/ErrorHanlder';

export default (
    app: Express,
    config: Config,
) => {
    app.post(
        "/api/posts",
        errorHandler(async (req, res, _) => {
            const { id, commitment, vote } = req.body;
            
            const newVote = await config.voteService.sendVote(id, commitment, vote as VoteType);

            res.status(201).json({ status: 'success', vote: newVote });
        }),
    );
}