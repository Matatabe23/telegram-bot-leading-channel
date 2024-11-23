import { $autHost, $host, adminData } from "@/shared";
import { jwtDecode } from "jwt-decode";

// Функция для авторизации пользователя
export const login = async (name: string, password: string) => {
    const { data } = await $host.get('api/admin/login', { params: { name, password } });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('admin', JSON.stringify(data.admin));
    return jwtDecode(data.accessToken);
}

// Проверка данных пользователя с обновлением токена, если он невалидный
export const checkDataWeb = async () => {
    try {
        const { data } = await $autHost.get('api/admin/check-data');
        localStorage.setItem('accessToken', data.accessToken);
        return jwtDecode(data.accessToken);
    } catch (e) {
        if (e.response && e.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const updatedTokens = await updateAccessToken(refreshToken);
                    const { data } = await $autHost.get('api/admin/check-data');
                    localStorage.setItem('accessToken', updatedTokens);
                    return jwtDecode(data.accessToken);
                } catch (error) {
                    throw new Error('Требуется авторизация');
                }
            } else {
                throw new Error('Требуется авторизация');
            }
        }
        throw e;
    }
}

// Обновление accessToken
export const updateAccessToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new Error('No refresh token found.');
    }
    const { data } = await $host.get('api/admin/update-access-token', { params: { refreshToken } });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
}

export const updateDataAdmin = async (data: adminData) => {
        const response = await $host.put('api/admin/update-data-admin', data);
        return response.data;
};

