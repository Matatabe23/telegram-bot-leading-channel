import { $autHost } from "@/shared";

export const uploadFilesToS3 = async (file: File, fileName: string) => {
    const formData = new FormData();
    formData.append('files[]', file);
    formData.append('fileName', fileName);
    const { data } = await $autHost.post('api/files/upload-filesTo-s3', formData);
    return data;
};
