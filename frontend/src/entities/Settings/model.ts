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