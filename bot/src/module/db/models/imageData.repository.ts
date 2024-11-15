import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DataBasePosts } from './data-base-posts.repository';

@Table
export class ImageData extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  image: string;

  @ForeignKey(() => DataBasePosts)
  @Column
  dataBasePostId: number;

  @BelongsTo(() => DataBasePosts)
  dataBasePost: DataBasePosts;
}
