import { HttpException } from './http-exception';

export class WrongAuthenticationTokenException extends HttpException {
	public constructor() {
		super(401, 'Wrong authentication token');
	}
}
