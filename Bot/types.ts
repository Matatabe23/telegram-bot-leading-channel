export interface IpublishTime {
  hour: number,
  minute: number
}

export interface IAdminDto {
  id: number;
  name: string;
  role: string;
  password?: string
}

export enum EAdministratorRole {
  USER = 'user',
  OWNER = 'owner'
}