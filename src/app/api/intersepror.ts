import axios, { CreateAxiosDefaults } from 'axios';

import { getAccessToken, removeAccessToken } from './services';

const options: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
};

const authOptions: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	withCredentials: true
};

const instance = axios.create(options);

const authInstance = axios.create(authOptions);

instance.interceptors.request.use(config => {
	const accessToken = getAccessToken();

	if (config?.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

instance.interceptors.response.use(
	response => response,
	error => {
		if (
			error.response &&
			(error.response.status === 403 || error.response.status === 401)
		) {
			removeAccessToken();

			window.location.href = '/auth';
		}

		return Promise.reject(error);
	}
);

export { instance, authInstance };
