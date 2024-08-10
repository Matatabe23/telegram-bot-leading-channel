import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class AdminDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  password?: string;

  constructor(admin: any) {
    this.id = admin.id;
    this.name = admin.name;
    this.role = admin.role;
  }
}
