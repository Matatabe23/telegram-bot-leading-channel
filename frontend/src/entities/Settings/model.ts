export interface IListChannels {
    id: number,
    name: string,
    chatId: string,
    settings: string,
    createdAt: string,
    updatedAt: string
}

export interface IStateStoreSettings {
    listChannels: IListChannels[]
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

export enum IEditChannelType {
    PRIVATED = 'privated',
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