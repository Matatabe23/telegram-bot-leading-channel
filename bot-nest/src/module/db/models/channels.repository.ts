import {
  Column,
  Model,
  Table,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { RegularPublicationTime } from './regularPublicationTime.repository';
import { DataBasePosts } from './data-base-posts.repository';
import { ChannelPosts } from './channel-posts.repository';

@Table
export class Channels extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  chatId: string;

  @Column
  settings: string;

  @HasMany(() => RegularPublicationTime)
  regularPublicationTimes: RegularPublicationTime[];

  @BelongsToMany(() => DataBasePosts, () => ChannelPosts)
  dataBasePosts: DataBasePosts[];
}