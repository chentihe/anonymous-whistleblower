import { Express } from 'express'
import { Config, InternalError } from '../types'
import { errorHandler } from '../middlewares/ErrorHanlder';

export default (
    app: Express,
    config: Config,
) => {
    app.post(
        "/api/posts",
        errorHandler(async (req, res, _) => {
            const { commitment, title, content } = req.body;
            
            const post = await config.postService.createPost(commitment, title, content);

            res.status(201).json({ status: 'success', post: post });
        }),
    );

    app.get(
        "/api/posts",
        errorHandler(async (req, res, _) => {
            const page = req.query.page ? Number(req.query.page) : 1
            if (isNaN(page) || page < 1) {
                throw new InternalError('Invalid page number', 400)
            }
            
            const posts = await config.postService.getPosts(page);

            res.status(200).json({ status: 'success', posts: posts });
        }),
    );

    app.get(
        "/api/posts/:id",
        errorHandler(async (req, res, _) => {
            const id = req.params.id;
            if (!id) {
                throw new InternalError('id is undefined', 400)
            }

            const page = req.query.page ? Number(req.query.page) : 1
            if (isNaN(page) || page < 1) {
                throw new InternalError('Invalid page number', 400)
            }

            const posts = await config.postService.getPostsByAuthor(id, page);
            if (!posts) {
                throw new InternalError(`post is not found: ${id}`, 400);
            } else {
                res.json(posts);
            }
        }),
    );
}