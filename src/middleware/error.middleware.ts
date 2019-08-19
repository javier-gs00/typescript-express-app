import { HttpException } from 'Src/exceptions/http-exception';
import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
	error: HttpException,
	req: Request,
	res: Response,
	next: NextFunction, // eslint-disable-line
): Response {
	const status = error.status || 500;
	const message = error.message || 'Something went wrong';

	return res.status(status).send({ status, message });
}
