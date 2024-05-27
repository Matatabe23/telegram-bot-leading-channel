import axios from 'axios'; 

const url = 'http://77.222.42.148:5000/'
// const url = 'http://localhost:5000/'

const $host = axios.create({
	baseURL: url
});

const $autHost = axios.create({
	baseURL: url
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