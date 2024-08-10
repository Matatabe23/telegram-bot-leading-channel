import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class DataBasePosts extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ defaultValue: false })
  watched: boolean;
}
