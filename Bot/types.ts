

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
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export enum EMiddlewareErrors {
  NOT_AUTHORIZED = 'Не авторизован',
  NO_ACCESS = 'Нет доступа',
  USER_NOT_FOUND = 'Пользователь не найден',
  ERROR = 'Ошибка'
}

export interface IAdministratorRole {
  id: number,
  NameRole: string,
  publisherPanel: boolean,
  userPanel: boolean,
  adminlist: boolean,
  ChangeInfo: string[]
}