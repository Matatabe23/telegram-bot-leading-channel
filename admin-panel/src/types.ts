export interface authInfo {
  name: string,
  password: string
}

export interface IMainPages {
  loader: boolean,
  auth: authInfo,
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

export interface post {
  id: number;
  description: string;
  imageData: { id: number; image: string }[];
}

export interface IPublishPosts {
  loaderPosts: boolean,
  currentPage: number,
  postsPerPage: number,
}

export interface IGetListRegularPublicationTimes{
  id: number,
  hour: string,
  minute: string,
  createdAt: string,
  updatedAt: string
}

export interface IAddingPublicationTimeSettings{
  hour: string,
  minute: string,
  listPublicationTimes: IGetListRegularPublicationTimes[]
}