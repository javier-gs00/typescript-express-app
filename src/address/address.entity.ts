import { PrimaryGeneratedColumn, OneToOne, Column, Entity } from 'typeorm';
import { User } from 'Src/users/user.entity';

@Entity()
export class Address {
	@PrimaryGeneratedColumn()
	public id: string;

	@Column('text')
	public street: string;

	@Column('text')
	public city: string;

	@Column('text')
	public country: string;

	@OneToOne(() => User, (user: User): Address => user.address)
	public user;
}
