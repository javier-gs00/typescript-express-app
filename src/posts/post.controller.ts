import express, { Request, Response, NextFunction } from 'express';
// import { Post } from './post.interface';
import { postModel } from './post.model';
import { Controller } from 'Src/interfaces/controller.interface';
import { PostNotFoundException } from 'Src/exceptions/post-not-found-exception';
import { validationMiddleware } from 'Src/middleware/validation.middleware';
import { CreatePostDto } from './post.dto';
import { authMiddleware } from 'Src/middleware/auth.middleware';
import { RequestWithUser } from 'Src/interfaces/request-with-user.interface';
import { getRepository } from 'typeorm';
import { Post } from './post.entity';

export class PostController implements Controller {
	public path = '/posts';
	public router = express.Router();
	// private post = postModel;
	private postRepository = getRepository(Post);

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
			validationMiddleware(CreatePostDto),
			this.createPost,
		); // eslint-disable-line
	}

	private getAllPosts = async (req: Request, res: Response): Promise<void> => {
		try {
			const posts = await this.postRepository.find({
				relations: ['categories'],
			});
			res.send(posts);
		} catch (error) {
			res.status(500).send(error);
		}
	};

	private getPostById = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response | void> => {
		const id: string = req.params.id;
		try {
			const post = await this.postRepository.findOne(id, {
				relations: ['categories'],
			});
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
		const id: string = req.params.id;
		try {
			const postData = req.body;
			await this.postRepository.update(id, postData);
			const updatedPost = await this.postRepository.findOne(id);
			if (updatedPost) {
				res.send(updatedPost);
			} else {
				next(new PostNotFoundException(id));
			}
		} catch (error) {
			return next(new PostNotFoundException(id));
		}
	};

	private createPost = async (req: Request, res: Response): Promise<void> => {
		try {
			const postData: CreatePostDto = req.body;
			const author = (req as RequestWithUser).user;
			const newPost = this.postRepository.create({
				...postData,
				author,
			});
			await this.postRepository.save(newPost);
			res.send(newPost);
		} catch (error) {
			res.status(500).send(error);
		}
	};

	private deletePost = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const id = req.params.id;
		const deleteResponse = await this.postRepository.delete(id);
		if (deleteResponse.raw[1]) {
			res.send(200);
		} else {
			next(new PostNotFoundException(id));
		}
	};
}
