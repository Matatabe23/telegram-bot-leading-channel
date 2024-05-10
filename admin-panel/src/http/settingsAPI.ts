import { $host, $autHost } from "@/http/index";

export const addingPublicationTime = async (hour: string, minute: string) => {
  const { data } = await $autHost.post('api/settings/addingPublicationTime',  {hour, minute});
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