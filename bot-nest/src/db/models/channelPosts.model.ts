import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Channels } from './channels.model';
import { DataBasePosts } from './dataBasePosts.model';

@Table
export class ChannelPosts extends Model {
  @ForeignKey(() => Channels)
  @Column
  channelId: number;

  @ForeignKey(() => DataBasePosts)
  @Column
  postId: number;
}
