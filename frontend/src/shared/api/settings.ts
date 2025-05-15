import { $autHost } from "@/shared";

export const addingNewChannels = async (name: string, chatId: string) => {
    const { data } = await $autHost.post('/settings/channel/create', { name, chatId });
    return data;
}

export const getListChannel = async () => {
    const { data } = await $autHost.get('/settings/channel/list');
    return data;
}

export const deleteChannel = async (id: number) => {
    const { data } = await $autHost.delete(`/settings/channel/${id}`);
    return data;
}

export const editChannel = async (id: number, settings: any) => {
    const { data } = await $autHost.put(`/settings/channel/${id}`, settings );
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




