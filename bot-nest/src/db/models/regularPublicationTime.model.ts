import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class RegularPublicationTime extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  hour: string;

  @Column
  minute: string;
}
