import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { DataBasePosts } from './data-base-posts.repository';
import { Tags } from './tags.repository';

@Table
export class PostTags extends Model {
	@ForeignKey(() => DataBasePosts)
	@Column
	postId: number;

	@ForeignKey(() => Tags)
	@Column
	tagId: number;
}
