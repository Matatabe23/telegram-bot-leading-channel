export * from './adminAPI';
export * from './postsAPI';
export * from './settingsAPI';
export * from './filesAPI';

import axios from 'axios';

// @ts-ignore
const url = import.meta.env.VITE_APP_BACKEND_API_URL


const $host = axios.create({
    baseURL: url
});

const $autHost = axios.create({
    baseURL: url
});

const authInterceptor = (config: any) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
};

$autHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $autHost
};

