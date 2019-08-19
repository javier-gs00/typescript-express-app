import express, { Request, Response, NextFunction } from 'express';
import { Controller } from 'Src/interfaces/controller.interface';
import { userModel } from 'Src/users/user.model';

export class ReportController implements Controller {
	public path = '/report';
	public router = express.Router();
	private user = userModel;

	public constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get(`${this.path}`, this.generateReport);
	}

	private generateReport = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const userByCountries = await this.user.aggregate([
				{
					$match: {
						'address.country': {
							$exists: true,
						},
					},
				},
				{
					$group: {
						_id: {
							country: '$address.country',
						},
						users: {
							$push: {
								name: '$name',
								_id: '$_id',
							},
						},
						count: {
							$sum: 1,
						},
					},
				},
				{
					// $lookup: {
					// 	from: 'users',
					// 	localField: 'users._id',
					// 	foreignField: '_id',
					// 	as: 'users',
					// },
					$lookup: {
						from: 'posts',
						localField: 'users._id',
						foreignField: 'author',
						as: 'articles',
					},
				},
				{
					$addFields: {
						amountOfArticles: {
							$size: '$articles',
						},
					},
				},
				{
					$sort: {
						amountOfArticles: 1,
					},
				},
			]);
			res.send({ userByCountries });
		} catch (error) {
			res.send({ message: 'internal server error' });
		}
	};
}
