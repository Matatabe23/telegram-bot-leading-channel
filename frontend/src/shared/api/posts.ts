import { $autHost } from "@/shared";
import { IImageBlock } from '@/shared'

// Функция публикации поста
export const publication = async (files: FileList, waterMark: boolean, chatIdList: string[]) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }
    formData.append('waterMark', waterMark.toString());
    formData.append('chatIdList', chatIdList.join(','));
    const { data } = await $autHost.post('posts/publication', formData);
    return data;
}

export const instantPublicationPosts = async (files: FileList, waterMark: boolean, chatIdList: string[]) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }
    formData.append('waterMark', waterMark.toString());
    formData.append('chatIdList', chatIdList.join(','));
    const { data } = await $autHost.post('posts/instant-publication-posts', formData);
    return data;
}

export const receiving = async (page: number, pageSize: number, watched?: string, channel?: string, search?: string) => {
    const { data } = await $autHost.get('posts/receiving', { params: { page, pageSize, watched, channel, search } });
    return data;
}

export const deletePost = async (id: number) => {
    const { data } = await $autHost.delete(`posts/delete-post/${id}`);
    return data;
}

export const publishInstantly = async (id: number) => {
    const { data } = await $autHost.post(`posts/publish-instantly/${id}`);
    return data;
}

export const receivingPost = async (id: number) => {
    const { data } = await $autHost.get(`posts/receiving-post/${id}`);
    return data;
}

export const changePage = async (id: number, where: string, watched: string, channel?: string) => {
    const { data } = await $autHost.get(`posts/change-page/${id}`, { params: { where, watched, channel } });
    return data;
}

export const deleteSelectedImgs = async (idList: IImageBlock) => {
    const { data } = await $autHost.get(`posts/delete-selected-imgs`, { params: { idList } });
    return data;
}

export const editPostLinkСhannels = async (postId: number, channelIds?: number[]) => {
    const { data } = await $autHost.put(`posts/edit-post-link-channels`, { postId, channelIds });
    return data;
}