'use client';

import React from 'react';

import { getAccessToken, removeAccessToken } from '@/app/api/services';

interface WebSocketContextType {
	socket: WebSocket | null;
	connect: (token: string) => void;
	disconnect: () => void;
	isConnected: boolean;
}

export const WebSocketContext = React.createContext<
	WebSocketContextType | undefined
>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [socket, setSocket] = React.useState<WebSocket | null>(null);
	const [isConnected, setIsConnected] = React.useState<boolean>(false);
	const socketRef = React.useRef<WebSocket | null>(null);

	const connect = (token: string) => {
		if (!token) {
			return;
		}

		const ws = new WebSocket(
			`${process.env.NEXT_PUBLIC_WS_URL}/auth/ws?token=${token}`
		);

		ws.onopen = () => {
			setIsConnected(true);
		};

		ws.onmessage = event => {
			const message = JSON.parse(event.data);

			if (message.type === 'AUTH_STATUS') {
				if (message.isAuthenticated == false) {
					const authUrl = new URL('/auth', window.location.origin);
					authUrl.hash = '#not-auth';
					window.location.href = authUrl.toString();
					removeAccessToken();
					ws.close();
				}
			}

			if (message.type === 'message') {
				console.log('Сообщение от сервера:', message.message);
			}
		};

		ws.onclose = () => {
			setIsConnected(false);
			removeAccessToken();
		};

		setSocket(ws);
		socketRef.current = ws;
	};

	const disconnect = () => {
		if (socketRef.current) {
			socketRef.current.close();
			setSocket(null);
			setIsConnected(false);
		}
	};

	React.useEffect(() => {
		const accessToken = getAccessToken();
		if (accessToken) {
			connect(accessToken);
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, []);

	return (
		<WebSocketContext.Provider
			value={{ socket, connect, disconnect, isConnected }}
		>
			{children}
		</WebSocketContext.Provider>
	);
};
