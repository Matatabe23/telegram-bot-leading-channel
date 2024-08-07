export interface IMainPages {
  auth: {
    name: string,
    password: string
  },
}

export interface IPublish {
  images: string[],
  imagePost: any,
  processLoader: {
    overlay: boolean,
    total: number,
    loaded: number
  },
  settingsArray: string[],
  form: {
    useChannelList: string[]
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
  channelId: number,
  listPublicationTimes: IGetListRegularPublicationTimes[],
  timeType: string
}

export interface IGetListChannels {
  id: number,
  name: string,
  chatId: string,
  settings: string,
  createdAt: string,
  updatedAt: string
}

export interface IStateChannels {
  form: {
    name: string,
    chatId: string,

    listChannels: IGetListChannels[]
  }
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

export enum IEditChannelType {
  PRIVATED = 'privated',
}

