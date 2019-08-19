import { Request } from 'express';
import { User } from 'Src/users/user.interface';

export interface RequestWithUser extends Request {
	user: User;
}
