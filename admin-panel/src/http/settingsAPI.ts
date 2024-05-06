import { $host, $autHost } from "@/http/index";

export const addingPublicationTime = async (hour: string, minute: string) => {
  const { data } = await $autHost.get('api/settings/addingPublicationTime', { params: { hour, minute } });
  return data;
}