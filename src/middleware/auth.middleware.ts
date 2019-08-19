import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from 'Src/interfaces/request-with-user.interface';
import { DataStoredInToken } from 'Src/interfaces/dataStoredInToken';
import { userModel } from 'Src/users/user.model';
import { WrongAuthenticationTokenException } from 'Src/exceptions/wrong-authentication-token-exception';
import { RequestHandler } from 'express-serve-static-core';

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	const cookies = req.cookies;
	if (cookies && cookies.Authorization) {
		const secret = process.env.JWT_SECRET || '';
		try {
			const verificationResponse = jwt.verify(
				cookies.Authorization,
				secret,
			) as DataStoredInToken;
			const id = verificationResponse._id;
			const user = await userModel.findById(id);
			if (user) {
				req.user = user; // attach the user object to the request
				next();
			} else {
				next(new WrongAuthenticationTokenException());
			}
		} catch (error) {
			next(new WrongAuthenticationTokenException());
		}
	} else {
		next(new WrongAuthenticationTokenException());
	}
}
