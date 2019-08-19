import { ConnectionOptions } from 'typeorm';

const extension = process.env.NODE_ENV === 'development' ? 'ts' : 'js';

export const typeormConfig: ConnectionOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'home',
	password: 'password',
	database: 'typescript-express',
	entities: [__dirname + `/../**/*.entity.${extension}`],
	synchronize: false,
};
