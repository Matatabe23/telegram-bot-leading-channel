export interface IListChannels {
    id: number,
    name: string,
    chatId: string,
    settings: string,
    createdAt: string,
    updatedAt: string
}

export interface IStateStoreSettings {
    listChannels: IListChannels[],
    listRoles: IGetListRoles[],
}

export interface IGetListRoles {
    id: number,
    name: string,
    permissions: string[],
    createdAt: string,
    updatedAt: string
}

export interface IStateChannels {
    form: {
        name: string,
        chatId: string,

        listChannels: IListChannels[]
    }
}

export interface IStateRoles {
    form: {
        name: string,
    },
    listRoles: IGetListRoles[]
}

export enum IEditChannelType {
    PRIVATED = 'privated',
    ADVERTISEMENT = 'advertisement'
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