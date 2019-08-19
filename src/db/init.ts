import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
	mongoose.connection.on('connecting', (): void =>
		console.log('DB connection being established'),
	);
	mongoose.connection.on('connected', (): void =>
		console.log('DB connection established'),
	);
	mongoose.connection.on('reconnected', (): void =>
		console.log('DB connection re established'),
	);
	mongoose.connection.on('disconnected', (): void =>
		console.log('DB connection disconnected'),
	);
	mongoose.connection.on('close', (): void =>
		console.log('DB connection closed'),
	);
	mongoose.connection.on('error', (err): void =>
		console.log('DB connection error', err),
	);
	// const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env
	const uri = 'mongodb://localhost:27017/express-typescript-tutorial';
	await mongoose.connect(uri, {
		useNewUrlParser: true,
	});
}
