'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';

import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui';
import { WebSocketProvider } from './ws-provider';

export function Providers({ children }: PropsWithChildren) {
	const [client] = React.useState(
		new QueryClient({
			defaultOptions: { queries: { refetchOnWindowFocus: false } }
		})
	);

	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
		>
			<QueryClientProvider client={client}>
				<WebSocketProvider>
					<Toaster
						position='top-center'
						duration={2000}
					/>
					{children}
				</WebSocketProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
