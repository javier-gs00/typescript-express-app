import { HttpException } from './http-exception';

export class WrongCredentialsException extends HttpException {
	public constructor() {
		super(401, 'Wrong credentials provided');
	}
}
