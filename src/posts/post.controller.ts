import express, { Request, Response, NextFunction } from 'express';
import { Post } from './post.interface';
import { postModel } from './post.model';
import { Controller } from 'Src/interfaces/controller.interface';
import { PostNotFoundException } from 'Src/exceptions/post-not-found-exception';
import { validationMiddleware } from 'Src/middleware/validation.middleware';
import { CreatePostDto } from './post.dto';
import { authMiddleware } from 'Src/middleware/auth.middleware';
import { RequestWithUser } from 'Src/interfaces/request-with-user.interface';

export class PostController implements Controller {
	public path = '/posts';
	public router = express.Router();
	private post = postModel;

	public constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes(): void {
		this.router.get(this.path, this.getAllPosts);
		this.router.get(`${this.path}/:id`, this.getPostById);
		this.router.patch(
			`${this.path}/:id`,
			authMiddleware,
			validationMiddleware(CreatePostDto, true),
			this.modifyPost,
		);
		this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);

		this.router.post(
			this.path,
			authMiddleware,
			validationMiddleware(CreatePostDto),
			this.createPost,
		); // eslint-disable-line
	}

	private getAllPosts = async (
		req: Request,
		res: Response,
	): Promise<Response> => {
		const posts = await this.post.find();
		// const posts = await this.post.find().populate('author', '-password');
		return res.send(posts);
	};

	private getPostById = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const id = req.params.id;
		try {
			const post = await this.post.findById(id);
			return res.send(post);
		} catch (error) {
			return next(new PostNotFoundException(id));
		}
	};

	private modifyPost = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const id = req.params.id;
		try {
			const postData = req.body;
			const post = await this.post.findByIdAndUpdate(id, postData, {
				new: true,
			});
			return res.send(post);
		} catch (error) {
			return next(new PostNotFoundException(id));
		}
	};

	private createPost = async (req: Request, res: Response): Promise<void> => {
		try {
			const postData: Post = req.body;
			const createdPost = new this.post({
				...postData,
				author: (req as RequestWithUser).user._id,
			});
			const savedPost = await createdPost.save();
			await savedPost.populate('author', '-password').execPopulate();
			res.send(savedPost);
		} catch (error) {
			console.log(error);
			res.status(500).send({
				message: 'An unexpected error ocurred trying to save the post',
			});
		}
	};

	private deletePost = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const id = req.params.id;
		const response = await this.post.findByIdAndDelete(id);
		if (response) {
			return res.send(200);
		}
		return next(new PostNotFoundException(id));
	};
}
