

export interface IPublishTime {
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
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export interface IAdministratorRole {
  id: number,
  nameRole: EAdministratorRole,
  publisherPanelAccess: boolean,
  usersPanelAccess: boolean,
  AdminslistAccess: boolean,
  ChangeInfo: string[]
}