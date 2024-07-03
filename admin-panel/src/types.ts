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
  processLoader: {
    overlay: boolean,
    total: number,
    loaded: number
  }
}

export interface IImageData {
  createdAt: string,
  dataBasePostId: string,
  id: number,
  image: string,
  updatedAt: string
}

export interface IPosts {
  createdAt: string,
  updatedAt: string,
  id: number,
  imageData: IImageData[]
}

export interface IPublishTime {
  createdAt: string,
  hour: string,
  id: number,
  minute: string,
  updatedAt: string
}

export interface IPostsList {
  posts: IPosts[],
  publishTime: IPublishTime,
  totalCount: number
}

export interface IPublishPosts {
  loaderPosts: boolean,
  currentPage: number,
  postsPerPage: number,
}

export interface IGetListRegularPublicationTimes {
  id: number,
  hour: string,
  minute: string,
  createdAt: string,
  updatedAt: string
}

export interface IAddingPublicationTimeSettings {
  hour: string,
  minute: string,
  listPublicationTimes: IGetListRegularPublicationTimes[]
}

export interface IStoreState {
  isLoader: boolean,
  postsList: IPosts[],
  totalCount: number,
  publishTime: IPublishTime[],
  form: {
    currentPage: number,
    postsPerPage: number
  }
}