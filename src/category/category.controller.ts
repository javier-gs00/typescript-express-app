import * as express from 'express';
import { getRepository } from 'typeorm';
import { CreateCategoryDto } from './category.dto';
import { Category } from './category.entity';
import { Controller } from 'Src/interfaces/controller.interface';
import { validationMiddleware } from 'Src/middleware/validation.middleware';
import { CategoryNotFoundException } from 'Src/exceptions/category-not-found-exception';

export class CategoryController implements Controller {
	public path = '/categories';
	public router = express.Router();
	private categoryRepository = getRepository(Category);

	public constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get(this.path, this.getAllCategories);
		this.router.get(`${this.path}/:id`, this.getCategoryById);
		this.router.post(
			this.path,
			validationMiddleware(CreateCategoryDto),
			this.createCategory,
		);
	}

	private getAllCategories = async (
		request: express.Request,
		response: express.Response,
	): Promise<void> => {
		const categories = await this.categoryRepository.find({
			relations: ['posts'],
		});
		response.send(categories);
	};

	private getCategoryById = async (
		request: express.Request,
		response: express.Response,
		next: express.NextFunction,
	): Promise<void> => {
		const id = request.params.id;
		const category = await this.categoryRepository.findOne(id, {
			relations: ['posts'],
		});
		if (category) {
			response.send(category);
		} else {
			next(new CategoryNotFoundException(id));
		}
	};

	private createCategory = async (
		request: express.Request,
		response: express.Response,
	): Promise<void> => {
		const categoryData: CreateCategoryDto = request.body;
		const newCategory = this.categoryRepository.create(categoryData);
		await this.categoryRepository.save(newCategory);
		response.send(newCategory);
	};
}
