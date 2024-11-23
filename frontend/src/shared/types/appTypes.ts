export interface IAuth {
    auth: {
        name: string,
        password: string
    },
}

export interface adminData {
    id: number,
    name: string,
    role: string
    avatarUrl?: string,
    telegramId?: string
}

export interface IAppStore {
    adminData: adminData | null,
    auth: boolean,
    width: number,
    height: number,
    isLoading: boolean,
}