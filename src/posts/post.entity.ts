import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinTable,
} from 'typeorm';
import { User } from 'Src/users/user.entity';
import { Category } from 'Src/category/category.entity';

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	public id?: string;

	@Column('text')
	public title: string;

	@Column('text')
	public content: string;

	@ManyToOne(() => User, (author: User): Post[] => author.posts)
	public author: User;

	@ManyToOne(() => Category, (category: Category): Post[] => category.posts)
	@JoinTable()
	public categories: Category[];
}
