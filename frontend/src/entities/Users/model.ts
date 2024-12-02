import { adminData } from "@/shared";

export interface IStateUsers {
    form: {
        name: string,
    },
    currentPage: number,
    totalItems: number,
    totalPages: number,
    usersList: adminData[],
    isModalCreateUser: boolean
}