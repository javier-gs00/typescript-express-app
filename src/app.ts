import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { Controller } from './interfaces/controller.interface';
import { errorMiddleware } from './middleware/error.middleware';

mongoose.Promise = global.Promise;

export class App {
	public app: Application;
	public port: number;

	public constructor(controllers: Controller[], port: number) {
		this.app = express();
		this.port = port;

		this.initializeMiddleware();
		this.initializeControllers(controllers);
		this.initializeErrorHandling();
	}

	private initializeMiddleware(): void {
		this.app.use(bodyParser.json());
		this.app.use(cookieParser());
	}

	private initializeErrorHandling(): void {
		this.app.use(errorMiddleware);
	}

	private initializeControllers(controllers: Controller[]): void {
		controllers.forEach((controller): void => {
			this.app.use('/', controller.router);
		});
	}

	public listen(): void {
		this.app.listen(this.port, (): void => {
			console.log(`App listening on port ${this.port}`);
		});
	}
}
