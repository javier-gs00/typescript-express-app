import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpException } from 'Src/exceptions/http-exception';
import { RequestWithUser } from 'Src/interfaces/request-with-user.interface';

export function validationMiddleware<T>(
	type: any,
	skipMissingProperties = false,
): RequestHandler {
	return async (
		req: Request | RequestWithUser,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const errors = await validate(plainToClass(type, req.body), {
			skipMissingProperties,
		});
		if (errors.length > 0) {
			const message = errors
				.map((error: ValidationError): string[] => {
					return Object.values(error.constraints);
				})
				.join(', ');
			next(new HttpException(400, message));
		} else {
			next();
		}
	};
}
