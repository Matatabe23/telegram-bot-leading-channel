import { $host, $autHost } from "@/http/index";

export const addingPublicationTime = async (hour: string, minute: string) => {
  const { data } = await $autHost.post('api/settings/addingPublicationTime', { hour, minute });
  return data;
}

export const getListRegularPublicationTimes = async () => {
  const { data } = await $autHost.get('api/settings/getListRegularPublicationTimes');
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

export const editChannel = async (id: number, value: boolean, type: string) => {
  const { data } = await $autHost.put('api/settings/editChannel', { id, value, type } );
  return data;
}