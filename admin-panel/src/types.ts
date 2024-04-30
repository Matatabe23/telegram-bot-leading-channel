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

export interface IPublish {
  loader: boolean,
  isSettingsPanelOpen: boolean
  images: string[],
  imagePost: any,
  waterMark: boolean,
  instantPublication: boolean,
}

export interface IPublishPosts {
  posts: any,
  loaderPosts: boolean,
  currentPage: number,
  postsPerPage: number,
  totalCount: number
}