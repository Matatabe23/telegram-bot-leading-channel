import { Column, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { DataBasePosts } from './data-base-posts.repository';
import { PostTags } from './post-tags.repository';

@Table
export class Tags extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column({ unique: true })
	name: string;

	@BelongsToMany(() => DataBasePosts, () => PostTags)
	posts: DataBasePosts[];
}
