import {
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
	OneToMany,
	Entity,
} from 'typeorm';
import { Address } from 'Src/address/address.entity';
import { Post } from 'Src/posts/post.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	public id: string;

	@Column('text')
	public name: string;

	@Column('text')
	public email: string;

	@Column('text')
	public password: string;

	@OneToOne(() => Address, (address: Address): User => address.user, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	public address: Address;

	@OneToMany(() => Post, (post: Post): User => post.author)
	public posts: Post[];
}
