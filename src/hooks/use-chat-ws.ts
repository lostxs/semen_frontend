import React from 'react';

import { Message } from '@/components/conversation';

import { MessageService } from '@/app/api/services';

export const useChatWs = (
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
	setActiveUsers: React.Dispatch<React.SetStateAction<string[]>>,
	setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>
) => {
	const [socket, setSocket] = React.useState<WebSocket | null>(null);

	React.useEffect(() => {
		const connect = async () => {
			try {
				const token = await MessageService.getToken();
				const ws = new WebSocket(
					`${process.env.NEXT_PUBLIC_WS_URL}/messages/ws?chat_token=${token}`
				);

				ws.onmessage = event => {
					const data = JSON.parse(event.data);

					switch (data.type) {
						case 'initial_load':
							setMessages(data.messages);
							break;
						case 'more_messages':
							setMessages(prevMessages => [...data.messages, ...prevMessages]);
							break;
						case 'new_message':
						case 'broadcast_message':
						case 'system_message':
							setMessages((prevMessages: Message[]) => [...prevMessages, data]);
							break;
						case 'users_list':
							setActiveUsers(data.users);
							break;
						case 'typing':
							setTypingUsers(prevUsers => {
								if (!prevUsers.includes(data.username)) {
									return [...prevUsers, data.username];
								}
								return prevUsers;
							});
							break;
						case 'stop_typing':
							setTypingUsers(prevUsers =>
								prevUsers.filter(user => user !== data.username)
							);
							break;
						default:
							console.warn(`Unhandled message type: ${data.type}`);
					}
				};

				ws.onerror = event => {
					console.error('WebSocket error:', event);
				};

				ws.onclose = () => {
					console.log('WebSocket connection closed. Reconnecting...');
					setTimeout(connect, 5000);
				};

				setSocket(ws);
			} catch (error) {
				console.error('Ошибка подключения к WebSocket:', error);
			}
		};

		connect();

		return () => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
			setTypingUsers([]);
			setActiveUsers([]);
		};
	}, []);

	return socket;
};
