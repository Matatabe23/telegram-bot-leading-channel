import { $autHost } from "@/shared";

export const addingPublicationTime = async (hour: string, minute: string, channelId: number) => {
    const { data } = await $autHost.post('settings/adding-publication-time', { hour, minute, channelId });
    return data;
}

export const getListRegularPublicationTimes = async (channelId: number) => {
    const { data } = await $autHost.get('settings/get-list-regular-publication-times', { params: { channelId } });
    return data;
}

export const deleteItemPublicationTimes = async (id: number) => {
    const { data } = await $autHost.delete(`settings/delete-item-publication-times/${id}`);
    return data;
}

export const addingNewChannels = async (name: string, chatId: string) => {
    const { data } = await $autHost.post('settings/adding-new-channels', { name, chatId });
    return data;
}

export const getListChannel = async () => {
    const { data } = await $autHost.get('settings/get-list-channel');
    return data;
}

export const deleteChannel = async (id: number) => {
    const { data } = await $autHost.delete(`settings/delete-channel/${id}`);
    return data;
}

export const editChannel = async (id: number, settings: string[]) => {
    const { data } = await $autHost.put('settings/edit-channel', { id, settings });
    return data;
}