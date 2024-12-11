import { userData } from "@/shared";

export interface IStateUsers {
    form: {
        name: string,
    },
    currentPage: number,
    totalItems: number,
    totalPages: number,
    usersList: userData[],
}