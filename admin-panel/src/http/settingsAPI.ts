import { $host, $autHost } from "@/http/index";

export const addingPublicationTime = async (hour: string, minute: string) => {
  const { data } = await $autHost.post('api/settings/addingPublicationTime',  {hour, minute});
  return data;
}