import { $autHost, $host } from "@/http/index";
import { jwtDecode } from "jwt-decode";

// Функция публикации поста
export const publication = async (photos: any) => {
  console.log(photos)
	const { data } = await $host.post('api/posts/publication', photos.result)
	// return jwtDecode(data)
}