import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Channels } from './channels.repository';

@Table
export class RegularPublicationTime extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  hour: string;

  @Column
  minute: string;

  @ForeignKey(() => Channels)
  @Column
  channelId: number;

  @BelongsTo(() => Channels)
  channel: Channels;
}
