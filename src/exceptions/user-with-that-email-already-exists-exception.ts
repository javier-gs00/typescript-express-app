import { HttpException } from './http-exception';

export class UserWithThatEmailAlreadyExistsException extends HttpException {
	public constructor(email: string) {
		super(400, `User with email ${email} already exists`);
	}
}
