import axios from 'axios'; 

const $host = axios.create({
	baseURL: 'http://localhost:5000/'
});

const $autHost = axios.create({
	baseURL: 'http://localhost:5000/'
});

const authInterceptor = (config: any) => {
	config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
	return config;
};

$autHost.interceptors.request.use(authInterceptor);

export {
	$host,
	$autHost
};