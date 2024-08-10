import { Column, Model, Table } from 'sequelize-typescript';
import { EAdministratorRole } from '../../types-and-constants/types';

@Table
export class Administrators extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column
  password: string;

  @Column({ defaultValue: EAdministratorRole.USER })
  role: EAdministratorRole;
}
