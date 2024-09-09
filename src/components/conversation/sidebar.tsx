'use client';

import { IconArrowLeft, IconLogout } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useState } from 'react';

import {
	Sidebar,
	SidebarBody,
	SidebarLabel,
	SidebarLink,
	SidebarUsers,
	Skeleton
} from '../ui';

import { authService } from '@/app/api/services';
import { cn } from '@/lib/utils';

interface Props {
	users: string[];
	loading?: boolean;
}
export function ChatSidebar({ users, loading }: Props) {
	const handleLogout = async () => {
		try {
			await authService.logout();
			window.location.href = '/auth';
		} catch (error) {
			console.error('Ошибка при выходе из аккаунта:', error);
		}
	};
	const links = [
		{
			label: 'Выйти из аккаунта',
			onClick: handleLogout,
			icon: (
				<IconArrowLeft className='text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0' />
			)
		}
	];

	const labels = [
		{
			label: 'Активные пользователи'
		}
	];
	const [open, setOpen] = useState(false);
	return (
		<div className={cn('h-screen')}>
			<Sidebar
				open={open}
				setOpen={setOpen}
			>
				<SidebarBody className='justify-between gap-10'>
					<div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
						{open ? <Logo /> : <LogoIcon />}
						<div className='mt-8 flex flex-col gap-2'>
							{labels.map((label, idx) => (
								<SidebarLabel
									key={idx}
									label={label}
								/>
							))}
							{loading
								? Array.from({ length: 5 }).map((_, idx) => (
										<div
											key={idx}
											className='flex items-start'
										>
											<Skeleton className='w-5 h-5 mr-2' />
											<Skeleton className='w-[40%] h-5' />
										</div>
									))
								: users.map((user, idx) => (
										<SidebarUsers
											key={idx}
											user={user}
										/>
									))}{' '}
							{links.map((link, idx) => (
								<SidebarLink
									key={idx}
									link={link}
									onClick={link.onClick}
								/>
							))}
						</div>
					</div>
				</SidebarBody>
			</Sidebar>
		</div>
	);
}
export const Logo = () => {
	return (
		<Link
			href='#'
			className='flex w-fit space-x-2 items-center text-sm py-1 relative z-20 text-black dark:text-white hover:text-neutral-800 dark:hover:text-primary'
		>
			<div className='h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='font-semibold whitespace-pre'
			>
				Чат Семена
			</motion.span>
		</Link>
	);
};

export const LogoIcon = () => {
	return (
		<Link
			href='#'
			className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'
		>
			<div className='h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
		</Link>
	);
};
