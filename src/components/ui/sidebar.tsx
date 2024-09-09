'use client';

import { IconMenu2, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link, { LinkProps } from 'next/link';
import React, { createContext, useContext, useState } from 'react';

import { Avatar, AvatarFallback } from './avatar';
import { cn } from '@/lib/utils';

interface Links {
	label: string;
	href?: string; // Делаем href необязательным
	onClick?: () => void; // Добавляем onClick
	icon: React.JSX.Element | React.ReactNode;
}

interface Labels {
	label: string;
	icon?: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
	undefined
);

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
};

export const SidebarProvider = ({
	children,
	open: openProp,
	setOpen: setOpenProp,
	animate = true
}: {
	children: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	const [openState, setOpenState] = useState(false);

	const open = openProp !== undefined ? openProp : openState;
	const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

	return (
		<SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
			{children}
		</SidebarContext.Provider>
	);
};

export const Sidebar = ({
	children,
	open,
	setOpen,
	animate
}: {
	children: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	return (
		<SidebarProvider
			open={open}
			setOpen={setOpen}
			animate={animate}
		>
			{children}
		</SidebarProvider>
	);
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
	return (
		<>
			<DesktopSidebar {...props} />
			<MobileSidebar {...(props as React.ComponentProps<'div'>)} />
		</>
	);
};

export const DesktopSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div>) => {
	const { open, setOpen, animate } = useSidebar();
	return (
		<>
			<motion.div
				className={cn(
					'h-full px-4 py-4 hidden md:flex md:flex-col w-[300px] flex-shrink-0 bg-neutral-800/10',
					className
				)}
				animate={{
					width: animate ? (open ? '300px' : '60px') : '300px'
				}}
				onMouseEnter={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
				{...props}
			>
				{children}
			</motion.div>
		</>
	);
};

export const MobileSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) => {
	const { open, setOpen } = useSidebar();
	return (
		<>
			<div
				className={cn(
					'px-4 py-4 flex flex-row md:hidden items-center justify-between w-full bg-neutral-800/10 h-full'
				)}
				{...props}
			>
				<div className='flex justify-center z-20 w-full h-full'>
					<IconMenu2
						className='text-neutral-800 dark:text-neutral-200 cursor-pointer'
						onClick={() => setOpen(!open)}
					/>
				</div>
				<AnimatePresence>
					{open && (
						<motion.div
							initial={{ x: '-100%', opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: '-100%', opacity: 0 }}
							transition={{
								duration: 0.3,
								ease: 'easeInOut'
							}}
							className={cn(
								'fixed h-full w-full inset-0 p-10 z-[100] flex flex-col justify-center backdrop-blur-2xl',
								className
							)}
						>
							<div
								className='absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer'
								onClick={() => setOpen(!open)}
							>
								<IconX />
							</div>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};

export const SidebarLink = ({
	link,
	className,
	onClick,
	...props
}: {
	link: Links;
	className?: string;
	onClick?: () => void;
	props?: LinkProps;
}) => {
	const { open, animate } = useSidebar();
	return (
		<a
			onClick={onClick}
			className={cn(
				'flex items-center justify-start gap-2 w-fit group/sidebar py-2 cursor-pointer',
				className
			)}
			{...props}
		>
			{link.icon}

			<motion.span
				animate={{
					display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
					opacity: animate ? (open ? 1 : 0) : 1
				}}
				className='text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0'
			>
				{link.label}
			</motion.span>
		</a>
	);
};

export const SidebarLabel = ({
	label,
	className,
	...props
}: {
	label: Labels;
	className?: string;
	props?: LinkProps;
}) => {
	const { open, animate } = useSidebar();
	return (
		<div
			className={cn(
				'flex items-center justify-start gap-2  group/sidebar py-2 font-semibold',
				className
			)}
			{...props}
		>
			{label.icon}

			<motion.span
				animate={{
					display: animate ? (open ? 'inline-block' : '') : 'inline-block',
					opacity: animate ? (open ? 1 : 0) : 1
				}}
				className='text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0'
			>
				{label.label}
			</motion.span>
		</div>
	);
};

export const SidebarUsers = ({
	user,
	className,
	...props
}: {
	user: string;
	className?: string;
	props?: LinkProps;
}) => {
	const { open, animate } = useSidebar();
	return (
		<div
			className={cn(
				'flex items-center justify-start gap-2  group/sidebar py-2',
				className
			)}
			{...props}
		>
			<Avatar className='h-5 w-5 flex-shrink-0'>
				<AvatarFallback>{user.substring(0, 1)}</AvatarFallback>
			</Avatar>

			<motion.span
				animate={{
					display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
					opacity: animate ? (open ? 1 : 0) : 1
				}}
				className='text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0'
			>
				{user}
			</motion.span>
		</div>
	);
};
