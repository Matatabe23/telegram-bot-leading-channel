export interface authInfo {
  name: string,
  password: string
}

export interface IMainPages {
  islogin: boolean,
  loader: boolean,
  auth: authInfo,
  name: string,
  password: string,
  confirmPassword: string,
}

export interface adminData {
  id: number,
  name: string,
  role: string
}

export interface AuthState {
  adminData: adminData | null,
  auth: boolean
}

export interface IPublishingPanel {
  loader: boolean,
  images: string[],
  imagePost: any,
  waterMark: boolean,
  instantPublication: boolean,
  isSettingsPanelOpen: boolean
}