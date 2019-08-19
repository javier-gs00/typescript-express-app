import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Post } from 'Src/posts/post.entity';

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	public id: string;

	@Column('text')
	public name: string;

	@ManyToMany(() => Post, (post: Post) => post.categories)
	public posts: Post[];
}
