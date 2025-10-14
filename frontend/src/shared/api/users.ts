import { $autHost, $host, userData } from '@/shared';

// Функция для авторизации пользователя
export const login = async (value: {
    name: string,
    deviceInfo?: {
        deviceName?: string;
        deviceType?: string;
        userAgent?: string;
        ipAddress?: string;
        location?: string;
        latitude?: number;
        longitude?: number;
        country?: string;
        city?: string;
        region?: string;
        timezone?: string;
        metadata?: { [key: string]: any; };
    }
}) => {
    const { data } = await $host.post('/user/login', value);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userData', JSON.stringify(data.user));
    return data.user;
};

// Проверка данных пользователя с обновлением токена, если он невалидный
export const getMeProfile = async () => {
    const { data } = await $autHost.get('user/me');
    return data;
};

// Обновление accessToken
export const updateAccessToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new Error('No refresh token found.');
    }
    const { data } = await $host.get('user/update-access-token', { params: { refreshToken } });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
};

// Обновление информации
export const updateDataUser = async (data: userData) => {
    const response = await $autHost.put('user/update-data-user', data);
    return response.data;
};

// Список юзеров
export const getUsersList = async (params: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}) => {
    const response = await $autHost.get('user/get-users-list', {
        params: params
    });
    return response.data;
};

//Удалить пользователя
export const deleteUser = async (id: number) => {
    const response = await $autHost.delete(`user/delete-post/${id}`);
    return response.data;
};
