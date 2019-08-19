import 'dotenv/config';
import { App } from './app';
import { connectToDatabase } from 'Src/db/init';
import { PostController } from './posts/post.controller';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserController } from './users/user.controller';
import { ReportController } from './reports/report.controller';
import { validateEnv } from './utils/validateEnv';

validateEnv();

async function startServer(): Promise<void> {
	await connectToDatabase();

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
