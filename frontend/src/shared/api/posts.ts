import { $autHost } from "@/shared";
import { IImageBlock } from '@/shared'

// Функция публикации поста
export const unifiedPublication = async (files: FileList, waterMark: boolean, chatIdList: string[], isInstant: boolean) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }
    formData.append('waterMark', waterMark.toString());
    formData.append('chatIdList', chatIdList.join(','));
    formData.append('isInstant', isInstant.toString());
    const { data } = await $autHost.post('posts/unified-publication', formData);
    return data;
}

export const receiving = async (page: number, perpage: number, watched?: string, channel?: string, search?: string) => {
    const { data } = await $autHost.get('posts/receiving', { params: { page, perpage, watched, channel, search } });
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

export const receivingPostOrChangePage = async (id: number, where?: string, watched?: string, channel?: string) => {
    const { data } = await $autHost.get(`posts/receiving-post-or-change-page/${id}`, { params: { where, watched, channel } });
    return data;
}

export const updatePosts = async (value: { id: number; channelIds?: number[]; images?: IImageBlock[] }) => {
    const { data } = await $autHost.put(`posts/update-posts`, value);
    return data;
}

export const receivingTags = async (params: { page: number, perPage: number, search?: string, sortBy?: string, sortOrder?: string }) => {
    const response = await $autHost.get('posts/get-tags', {
        params: params,
    });
    return response.data;
};