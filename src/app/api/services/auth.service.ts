import { authInstance, instance } from '../intersepror';

import { removeAccessToken, saveAccessToken } from './token.service';

export interface IAuthResponse {
	accessToken: string;
}

export const authService = {
	async login(data: { username: string; password: string }) {
		const res = await authInstance.post<IAuthResponse>('/auth/token', data);
		saveAccessToken(res.data.accessToken);
		return res;
	},

	async logout() {
		const res = await instance.post<IAuthResponse>('/auth/logout');
		removeAccessToken();
		return res;
	},

	async verify() {
		const res = await instance.get('/auth/verify');

		return res;
	}
};
