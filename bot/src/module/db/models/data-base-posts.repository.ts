import { Column, Model, Table, HasMany, BelongsToMany } from 'sequelize-typescript';
import { ImageData } from './imageData.repository';
import { Channels } from './channels.repository';
import { ChannelPosts } from './channel-posts.repository';

@Table
export class DataBasePosts extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column({ defaultValue: false })
	watched: boolean;

	@Column({ defaultValue: false })
	waterMark: boolean;

	@HasMany(() => ImageData)
	images: ImageData[];

	@BelongsToMany(() => Channels, () => ChannelPosts)
	channels: Channels[];
}
