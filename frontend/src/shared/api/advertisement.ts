import { IAdvertisement } from "@/entities";
import { $autHost } from "@/shared";

export const getListAdvertisements = async (params: {
    page: number,
    perPage: number,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
}) => {
    const { data } = await $autHost.get('advertisements/get-advertisements', {
        params: params,
    });
    return data;
}

export const updateAdvertisement = async (advertisement: IAdvertisement) => {
    const { data } = await $autHost.put(`advertisements/update-advertisement`, { advertisement });
    return data;
}
