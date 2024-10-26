import { $autHost } from "@/shared";

export const addingPublicationTime = async (hour: string, minute: string, channelId: number) => {
    const { data } = await $autHost.post('api/settings/addingPublicationTime', { hour, minute, channelId });
    return data;
}

export const getListRegularPublicationTimes = async (channelId: number) => {
    const { data } = await $autHost.get('api/settings/getListRegularPublicationTimes', { params: { channelId } });
    return data;
}

export const deleteItemPublicationTimes = async (id: number) => {
    const { data } = await $autHost.delete(`api/settings/deleteItemPublicationTimes/${id}`);
    return data;
}

export const addingNewChannels = async (name: string, chatId: string) => {
    const { data } = await $autHost.post('api/settings/addingNewChannels', { name, chatId });
    return data;
}

export const getListChannel = async () => {
    const { data } = await $autHost.get('api/settings/getListChannel');
    return data;
}

export const deleteChannel = async (id: number) => {
    const { data } = await $autHost.delete(`api/settings/deleteChannel/${id}`);
    return data;
}

export const editChannel = async (id: number, settings: string[]) => {
    const { data } = await $autHost.put('api/settings/editChannel', { id, settings });
    return data;
}