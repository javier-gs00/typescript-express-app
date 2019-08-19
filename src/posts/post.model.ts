import mongoose, { Schema } from 'mongoose';
import { Post } from './post.interface';

const postSchema = new mongoose.Schema({
	author: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
	},
	authorId: Schema.Types.ObjectId,
	content: String,
	title: String,
});

export const postModel = mongoose.model<Post & mongoose.Document>(
	'Post',
	postSchema,
);
