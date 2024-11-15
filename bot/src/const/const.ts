import { EAdministratorRole, IAdministratorRole } from '../type/types';

export const roles: IAdministratorRole[] = [
  {
    id: 1,
    nameRole: EAdministratorRole.DEVELOPER,
    publisherPanelAccess: true,
    usersPanelAccess: true,
    AdminslistAccess: true,
    ChangeInfo: [
      EAdministratorRole.DEVELOPER,
      EAdministratorRole.ADMIN,
      EAdministratorRole.MODERATOR,
    ],
  },
  {
    id: 3,
    nameRole: EAdministratorRole.ADMIN,
    publisherPanelAccess: true,
    usersPanelAccess: true,
    AdminslistAccess: false,
    ChangeInfo: [EAdministratorRole.MODERATOR],
  },
  {
    id: 4,
    nameRole: EAdministratorRole.MODERATOR,
    publisherPanelAccess: false,
    usersPanelAccess: true,
    AdminslistAccess: false,
    ChangeInfo: [],
  },
];
