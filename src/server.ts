import 'dotenv/config';
import 'reflect-metadata';
import { App } from './app';
import { connectToDatabase } from 'Src/db/init';
import { PostController } from './posts/post.controller';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserController } from './users/user.controller';
import { ReportController } from './reports/report.controller';
import { validateEnv } from './utils/validateEnv';
import { createConnection } from 'typeorm';
import { typeormConfig } from './ormconfig';

validateEnv();

async function startServer(): Promise<void> {
	// await connectToDatabase();
	try {
		await createConnection(typeormConfig);
	} catch (error) {
		console.log('Error while connecting to the database', error);
		return error;
	}
	const app = new App(
		[
			new PostController(),
			new AuthenticationController(),
			new UserController(),
			new ReportController(),
		],
		5000,
	);

	app.listen();
}

startServer();
