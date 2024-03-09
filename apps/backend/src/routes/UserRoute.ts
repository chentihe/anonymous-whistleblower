import { Express } from 'express'
import { Config } from '../types'
import { errorHandler } from '../middlewares/ErrorHanlder';

export default (
    app: Express,
    config: Config,
) => {
    app.post(
        "/api/signup",
        errorHandler(async (req, res, _) => {
            const { commitment } = req.body;
            
            await config.userService.signup(commitment);

            res.status(201).json({ status: 'success' });
        }),
    );
}