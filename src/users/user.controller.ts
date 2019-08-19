import express, { Request, Response, NextFunction } from 'express';
import { postModel } from 'Src/posts/post.model';
import { RequestWithUser } from 'Src/interfaces/request-with-user.interface';
import { authMiddleware } from 'Src/middleware/auth.middleware';
import { Controller } from 'Src/interfaces/controller.interface';

export class UserController implements Controller {
	public path = '/users';
	public router = express.Router();
	private post = postModel;

	public constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get(
			`${this.path}/:id/posts`,
			authMiddleware,
			this.getAllPostsOfUser,
		);
	}

	private getAllPostsOfUser = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const userId = req.params.id;
			if (userId === (req as RequestWithUser).user._id.toString()) {
				const posts = await this.post.find({ author: userId });
				res.send(posts);
			}
			next();
		} catch (error) {
			res.status(500).send({ message: 'unexpected error' });
		}
	};
}
