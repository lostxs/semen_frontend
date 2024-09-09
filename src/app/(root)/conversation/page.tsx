'use client';

import React from 'react';

import {
	Body,
	ChatField,
	ChatSidebar,
	Header,
	Message
} from '@/components/conversation';

import { useChatWs, useCurrentUser } from '@/hooks';

export default function ConversationPage() {
	const [messages, setMessages] = React.useState<Message[]>([]);
	const [inputValue, setInputValue] = React.useState('');
	const [activeUsers, setActiveUsers] = React.useState<string[]>([]);
	const [typingUsers, setTypingUsers] = React.useState<string[]>([]);

	const typingTimeout = React.useRef<NodeJS.Timeout | null>(null);

	const { data, isLoading } = useCurrentUser();
	const socket = useChatWs(setMessages, setActiveUsers, setTypingUsers);

	const handleSendMessage = (message: string) => {
		if (socket && message.trim()) {
			const messageData = JSON.stringify({
				action: 'send_message',
				username: data?.username,
				content: message,
				created_at: new Date().toISOString()
			});
			socket.send(messageData);
			setInputValue('');
		}
	};

	const handleTyping = () => {
		if (socket) {
			socket.send(
				JSON.stringify({
					action: 'typing',
					username: data?.username
				})
			);
			if (data?.username === typingUsers[typingUsers.length - 1]) {
				setTypingUsers(prevUsers => {
					if (!prevUsers.includes(data?.username)) {
						return [...prevUsers, data?.username];
					}
					return prevUsers;
				});
			}

			if (typingTimeout.current) {
				clearTimeout(typingTimeout.current);
			}

			typingTimeout.current = setTimeout(() => {
				socket.send(
					JSON.stringify({
						action: 'stop_typing',
						username: data?.username
					})
				);

				setTypingUsers(prevUsers =>
					prevUsers.filter(user => user !== data?.username)
				);
			}, 300);
		}
	};

	const handleLoadMoreMessages = () => {
		if (socket) {
			socket.send(
				JSON.stringify({
					action: 'load_more_messages'
				})
			);
		}
	};

	return (
		<div className='flex h-screen'>
			<ChatSidebar
				users={activeUsers}
				loading={isLoading}
			/>

			<div className='flex flex-col flex-1 flex-grow min-h-screen'>
				<Header
					onlineUsers={activeUsers}
					typingUsers={typingUsers}
				/>
				<Body
					messages={messages}
					currentUser={data?.username}
					onLoadMoreMessages={handleLoadMoreMessages}
					loading={isLoading}
				/>

				<ChatField
					inputValue={inputValue}
					setInputValue={setInputValue}
					onSendMessage={handleSendMessage}
					onTyping={handleTyping}
					loading={isLoading}
				/>
			</div>
		</div>
	);
}
