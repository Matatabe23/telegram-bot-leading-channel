import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Channels } from './channels.repository';
import { DataBasePosts } from './dataBasePosts.repository';

@Table
export class ChannelPosts extends Model {
  @ForeignKey(() => Channels)
  @Column
  channelId: number;

  @ForeignKey(() => DataBasePosts)
  @Column
  postId: number;
}
