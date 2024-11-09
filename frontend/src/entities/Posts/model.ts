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

export interface IStoreStatePosts {
    postsList: IPosts[],
    totalCount: number,
    publishTime: IPublishTime[],
    form: {
        currentPage: number,
        postsPerPage: number,
        watched: string,
        channel: string
    }
}