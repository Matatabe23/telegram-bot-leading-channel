import { $host } from "@/http/index";

// Функция публикации поста
export const publication = async (files: FileList) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }
  const { data } = await $host.post('api/posts/publication', formData);
  return data;
}
