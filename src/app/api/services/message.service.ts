import { instance } from '../intersepror';

export const MessageService = {
	async getToken() {
		const res = await instance.get('/messages/request-chat-token');

		return res.data.chat_token;
	}
};
