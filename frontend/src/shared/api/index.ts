export * from './users';
export * from './posts';
export * from './settings';
export * from './files';
export * from './roles';
export * from './socket';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';



export const getMainInfo = async () => {
    const { data } = await $autHost.get('main-info');
    return data;
};

// @ts-ignore
const url = import.meta.env.VITE_APP_BACKEND_API_URL;

const $host = axios.create({
    baseURL: url
});

const $autHost = axios.create({
    baseURL: url
});

const authInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
};

$autHost.interceptors.request.use(authInterceptor);

// Флаг, чтобы не было зацикливания
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Добавляем подписчика для повторных запросов
function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

// Уведомляем подписчиков
function onRefreshed(token: string) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

// Интерцептор для обработки ошибок
$autHost.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(resolve => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.authorization = `Bearer ${token}`;
                        resolve($autHost(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(`${url}user/refresh-token`, {
                    refreshToken: localStorage.getItem('refreshToken')
                });

                // Сохраняем новые токены
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                // Уведомляем ждущие запросы
                onRefreshed(data.accessToken);

                // Повторяем исходный запрос
                originalRequest.headers.authorization = `Bearer ${data.accessToken}`;
                return $autHost(originalRequest);
            } catch (err) {
                // Если не удалось обновить токены — разлогиниваем
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);


export { $host, $autHost };
