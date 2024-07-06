export interface IMainPages {
  auth: {
    name: string,
    password: string
  },
}

export interface IPublish {
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

export interface IImageBlock {
  id: number,
  image: string,
  dataBasePostId: number
}

