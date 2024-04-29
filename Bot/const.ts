import {EAdministratorRole, IAdministratorRole} from './types'

export const publishTime = [
  { hour: 17, minute: 0 },
  { hour: 17, minute: 1 },
  { hour: 17, minute: 2 },
]

export const Roles: IAdministratorRole = [
  { id: 1, NameRole: EAdministratorRole.DEVELOPER, publisherPanel: true, userPanel: true, adminlist: true, ChangeInfo: [EAdministratorRole.DEVELOPER, EAdministratorRole.ADMIN, EAdministratorRole.MODERATOR], },
  { id: 3, NameRole: EAdministratorRole.ADMIN, publisherPanel: true, userPanel: true, adminlist: false, ChangeInfo: [EAdministratorRole.MODERATOR], },
  { id: 4, NameRole: EAdministratorRole.MODERATOR, publisherPanel: false, userPanel: true, adminlist: false, ChangeInfo: [], },
]
