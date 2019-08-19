import { HttpException } from './http-exception';

export class PostNotFoundException extends HttpException {
	public constructor(id: string) {
		super(404, `Post with id ${id} not found`);
	}
}
