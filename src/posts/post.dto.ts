import { IsString, ValidateNested } from 'class-validator';
import { User } from 'Src/users/user.entity';

export class CreatePostDto {
	// @IsString()
	// public author!: string;

	@IsString()
	public content!: string;

	@IsString()
	public title!: string;

	@ValidateNested()
	public author!: User;
}
