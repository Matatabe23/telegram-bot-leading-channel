export interface IAuth {
    auth: {
        name: string,
        password: string
    },
    loading: boolean
}

export interface adminData {
    id: number,
    name: string,
    role: string
}

export interface IStoreState {
    adminData: adminData | null,
    auth: boolean
}