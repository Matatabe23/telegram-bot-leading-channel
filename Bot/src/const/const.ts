import {EAdministratorRole, IAdministratorRole} from '../type/types.js'

export const publishTime = [
  { hour: 12, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 18, minute: 0 },
]

export const roles: IAdministratorRole[] = [
  { id: 1, nameRole: EAdministratorRole.DEVELOPER, publisherPanelAccess: true, usersPanelAccess: true, AdminslistAccess: true, ChangeInfo: [EAdministratorRole.DEVELOPER, EAdministratorRole.ADMIN, EAdministratorRole.MODERATOR], },
  { id: 3, nameRole: EAdministratorRole.ADMIN, publisherPanelAccess: true, usersPanelAccess: true, AdminslistAccess: false, ChangeInfo: [EAdministratorRole.MODERATOR], },
  { id: 4, nameRole: EAdministratorRole.MODERATOR, publisherPanelAccess: false, usersPanelAccess: true, AdminslistAccess: false, ChangeInfo: [], },
]

export const NOT_AUTHORIZED = 'Не авторизован';
export const NO_ACCESS = 'Нет доступа';
export const USER_NOT_FOUND = 'Пользователь не найден';
export const ERROR = 'Ошибка';

export const multerPath = 'src/image/'

export const waterMark = '#QugorArts'
