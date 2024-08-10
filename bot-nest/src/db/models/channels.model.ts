import { Column, Model, Table } from 'sequelize-typescript';

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
}
