import { instance } from '../intersepror';

export const userService = {
	async register(data: { username: string; email: string; password: string }) {
		const res = await instance.post('/user', data);

		return res;
	},

	async activate(data: { code: string }) {
		const res = await instance.post('/user/activate', data);

		return res;
	},

	async getCurrentUser() {
		const res = await instance.get('/user/current_user');
		return res.data;
	}
};
