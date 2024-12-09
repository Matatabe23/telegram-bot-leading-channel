import { $autHost, $host, userData } from "@/shared";
import { jwtDecode } from "jwt-decode";

// Создание нового пользователя
export const createUser = async (name: string, password: string) => {
    const response = await $autHost.post('user/create-user', { name, password });
    return response.data;
};

// Функция для авторизации пользователя
export const login = async (name: string, password: string) => {
    const { data } = await $host.get('user/login', { params: { name, password } });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return jwtDecode(data.accessToken);
}

// Проверка данных пользователя с обновлением токена, если он невалидный
export const checkDataWeb = async () => {
    try {
        const { data } = await $autHost.get('user/check-data');
        localStorage.setItem('accessToken', data.accessToken);
        return jwtDecode(data.accessToken);
    } catch (e) {
        if (e.response && e.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const updatedTokens = await updateAccessToken(refreshToken);
                    const { data } = await $autHost.get('user/check-data');
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
    const { data } = await $host.get('user/update-access-token', { params: { refreshToken } });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
}

// Обновление информации
export const updateDataUser = async (data: userData) => {
    const response = await $autHost.put('user/update-data-user', data);
    return response.data;
};

// Список юзеров
export const getUsersList = async (page: number, limit: number) => {
    const response = await $autHost.get('user/get-users-list', {
        params: { page, limit },
    });
    return response.data;
};

//Удалить пользователя
export const deleteUser = async (id: number) => {
    const response = await $autHost.delete(`user/delete-post/${id}`);
    return response.data;
};

// Обновление пароля
export const updatePassword = async (oldPassword: string, newPassword: string) => {
    const response = await $autHost.put('user/update-password', {oldPassword, newPassword});
    return response.data;
};
