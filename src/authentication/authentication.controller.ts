import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Controller } from 'Src/interfaces/controller.interface';
import { userModel } from 'Src/users/user.model';
import { CreateUserDto } from 'Src/users/user.dto';
import { UserWithThatEmailAlreadyExistsException } from 'Src/exceptions/user-with-that-email-already-exists-exception';
import { WrongCredentialsException } from 'Src/exceptions/wrong-credentias-exception';
import { validationMiddleware } from 'Src/middleware/validation.middleware';
import { LogInDto } from './login.dto';
import { User } from 'Src/users/user.interface';
import { TokenData } from 'Src/interfaces/tokenData.interface';
import { DataStoredInToken } from 'Src/interfaces/dataStoredInToken';
import jwt from 'jsonwebtoken';

export class AuthenticationController implements Controller {
	public path = '/auth';
	public router = express.Router();
	private user = userModel;

	public constructor() {
		console.log('initializing auth controller');
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post(
			`${this.path}/register`,
			validationMiddleware(CreateUserDto),
			this.registration,
		);
		this.router.post(
			`${this.path}/login`,
			validationMiddleware(LogInDto),
			this.loggingIn,
		);
		this.router.post(`${this.path}/logout`, this.loggingOut);
	}

	private registration = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userData: CreateUserDto = req.body;
		if (await this.user.findOne({ email: userData.email })) {
			next(new UserWithThatEmailAlreadyExistsException(userData.email));
		} else {
			const hashedPassword = await bcrypt.hash(userData.password, 10);
			const user = await this.user.create({
				...userData,
				password: hashedPassword,
			});
			user.password = undefined;
			const tokenData = this.createToken(user);
			res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
			res.send(user);
		}
	};

	private loggingIn = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const logInData: LogInDto = req.body;
		const user = await this.user.findOne({ email: logInData.email });
		if (user) {
			const isPasswordMatching = await bcrypt.compare(
				logInData.password,
				user.password,
			);

			if (isPasswordMatching) {
				user.password = undefined;
				const tokenData = this.createToken(user);
				res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
				res.send(user);
			} else {
				next(new WrongCredentialsException());
			}
		} else {
			next(new WrongCredentialsException());
		}
	};

	private loggingOut = (
		req: Request,
		res: Response,
		next: NextFunction,
	): void => {
		res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
		res.send();
	};

	private createCookie(tokenData: TokenData): string {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`; // eslint-disable-line
	}

	private createToken(user: User): TokenData {
		const expiresIn = 60 * 60; // an hour
		const secret: string = process.env.JWT_SECRET || '';
		const dataStoredInToken: DataStoredInToken = {
			_id: user._id,
		};

		return {
			expiresIn,
			token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
		};
	}
}
