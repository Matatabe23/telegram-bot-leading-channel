export * from './users';
export * from './posts';
export * from './settings';
export * from './files';
export * from './roles';
export * from './socket';

import axios from 'axios';

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

const authInterceptor = (config: any) => {
	config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
	return config;
};

$autHost.interceptors.request.use(authInterceptor);

export { $host, $autHost };
