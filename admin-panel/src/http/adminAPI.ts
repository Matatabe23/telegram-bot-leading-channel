import { $autHost, $host } from "@/http/index";
import { jwtDecode } from "jwt-decode";

// Функция для авторизации пользователя
export const login = async (name:string, password:string) => {
	const { data } = await $host.post('api/admin/login', { name, password })
	localStorage.setItem('token', data.token)
	localStorage.setItem('admin', JSON.stringify(data.admin));
	return jwtDecode(data.token)
}

//Проверка данных пользователя
export const checkDataWeb = async () => {
	const { data } = await $autHost.get('api/admin/CheckDataWeb',) 
	localStorage.setItem('token', data.token )
	localStorage.setItem('admin', JSON.stringify(data.admin));
	return jwtDecode(data.token)
}