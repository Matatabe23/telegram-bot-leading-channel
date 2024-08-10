import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class ImageData extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  image: string;
}
