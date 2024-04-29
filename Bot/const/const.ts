import {EAdministratorRole, IAdministratorRole} from '../type/types'

export const publishTime = [
  { hour: 17, minute: 0 },
  { hour: 17, minute: 1 },
  { hour: 17, minute: 2 },
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
