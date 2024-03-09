import { Express } from 'express'
import { Config } from '../types'
import { errorHandler } from '../middlewares/ErrorHanlder';

export default (
    app: Express,
    config: Config,
) => {
    app.post(
        "/api/proof",
        errorHandler(async (req, res, _) => {
            const { commitment } = req.body;
            if (commitment == null) {
                throw new Error("invalid commitment");
            }

            const proof = config.imtService.generateProof(commitment);

            res.status(201).json({ status: 'success', proof: proof });
        }),
    );
}