import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { RegularPublicationTime } from './regularPublicationTime.repository';

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
}
