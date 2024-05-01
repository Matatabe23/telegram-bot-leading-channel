import { $host, $autHost } from "@/http/index";

// Функция публикации поста
export const publication = async (files: FileList, waterMark: boolean, instantPublication: boolean) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }
  formData.append('waterMark', waterMark.toString());
  formData.append('instantPublication', instantPublication.toString());
  const { data } = await $autHost.post('api/posts/publication', formData);
  return data;
}

export const receiving = async (page: number, pageSize: number) => {
  const { data } = await $autHost.get('api/posts/receiving', { params: { page, pageSize } });
  return data;
}

export const deletePost = async (id: number) => {
  const { data } = await $autHost.delete(`api/posts/deletePost/${id}`);
  return data;
}

export const publishInstantly = async (id: number) => {
  const { data } = await $autHost.post(`api/posts/publishInstantly/${id}`);
  return data;
}