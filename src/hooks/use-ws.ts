import { useContext } from 'react';

import { WebSocketContext } from '@/components';

export const useWebSocket = () => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error(
			'useWebSocket должен использоваться внутри WebSocketProvider'
		);
	}
	return context;
};
