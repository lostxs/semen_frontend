'use client';

import React from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

import { Avatar, AvatarFallback } from './ui/avatar';

export const UserTest = () => {
	const { data, isLoading } = useCurrentUser();

	return isLoading ? (
		<div>Loading</div>
	) : (
		<Avatar>
			<AvatarFallback>{data.username}</AvatarFallback>
		</Avatar>
	);
};
