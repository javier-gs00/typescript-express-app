import { HttpException } from './http-exception';

export class CategoryNotFoundException extends HttpException {
	public constructor(id: string) {
		super(404, `Category with id ${id} not found`);
	}
}
