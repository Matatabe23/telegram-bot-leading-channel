import { $host, $autHost } from "@/http/index";
import { IImageBlock } from '@/types'

// Функция публикации поста
export const publication = async (files: FileList, waterMark: boolean, chatIdList: string[]) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }
  formData.append('waterMark', waterMark.toString());
  formData.append('chatIdList', chatIdList.join(','));
  const { data } = await $autHost.post('api/posts/publication', formData);
  return data;
}

export const instantPublicationPosts = async (files: FileList, waterMark: boolean, chatIdList: string[]) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }
  formData.append('waterMark', waterMark.toString());
  formData.append('chatIdList', chatIdList.join(','));
  const { data } = await $autHost.post('api/posts/instantPublicationPosts', formData);
  return data;
}

export const receiving = async (page: number, pageSize: number, watched?: string, channel?: string) => {
  const { data } = await $autHost.get('api/posts/receiving', { params: { page, pageSize, watched, channel } });
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

export const receivingPost = async (id: number) => {
  const { data } = await $autHost.get(`api/posts/receivingPost/${id}`);
  return data;
}

export const changePage = async (id: number, where: string, watched: string) => {
  const { data } = await $autHost.get(`api/posts/changePage/${id}`, { params: { where, watched } });
  return data;
}

export const deleteSelectedImgs = async (idList: IImageBlock) => {
  const { data } = await $autHost.get(`api/posts/deleteSelectedImgs`, { params: { idList } });
  return data;
}

export const editPostLinkСhannels = async (postId: number, channelIds?: number[]) => {
  const { data } = await $autHost.put(`api/posts/editPostLinkChannels`, { params: { postId, channelIds } });
  return data;
}