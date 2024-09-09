'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';

import { Avatar, AvatarFallback, ScrollArea, Skeleton } from '../ui';

import { cn } from '@/lib/utils';

export interface Message {
	id: number;
	username: string;
	content: string;
	created_at: string;
	type: 'user_message' | 'system_message';
}

interface Props {
	loading: boolean;
	messages: Message[];
	currentUser: string;
	onLoadMoreMessages: () => void;
}

export const Body: React.FC<Props> = ({
	loading,
	messages,
	currentUser,
	onLoadMoreMessages
}) => {
	const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);
	const previousMessageCount = React.useRef<number>(messages.length);
	const previousScrollHeight = React.useRef<number>(0);
	const previousScrollTop = React.useRef<number>(0);

	const [currentDate, setCurrentDate] = React.useState<string | null>(null);
	const [showDate, setShowDate] = React.useState<boolean>(false);
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (messages.length === previousMessageCount.current) {
			return;
		}

		if (messages.length > previousMessageCount.current) {
			if (scrollAreaRef.current) {
				const newScrollHeight = scrollAreaRef.current.scrollHeight;
				const scrollDiff = newScrollHeight - previousScrollHeight.current;

				scrollAreaRef.current.scrollTop =
					previousScrollTop.current + scrollDiff;
			}
		}

		previousMessageCount.current = messages.length;
	}, [messages]);

	const handleScroll = React.useCallback(() => {
		if (scrollAreaRef.current) {
			const scrollTop = scrollAreaRef.current.scrollTop;
			const scrollHeight = scrollAreaRef.current.scrollHeight;
			const clientHeight = scrollAreaRef.current.clientHeight;

			previousScrollHeight.current = scrollHeight;
			previousScrollTop.current = scrollTop;

			if (scrollTop / (scrollHeight - clientHeight) <= 0.2) {
				onLoadMoreMessages();
			}

			if (scrollTop / scrollHeight <= 0.4) {
				setShowDate(true);
			} else {
				setShowDate(false);
			}

			const visibleMessage = messages.find(message => {
				const messageElement = document.getElementById(`message-${message.id}`);
				if (messageElement) {
					const rect = messageElement.getBoundingClientRect();
					return rect.top >= 0 && rect.bottom <= window.innerHeight;
				}
				return false;
			});

			if (visibleMessage) {
				const formattedDate = format(
					new Date(visibleMessage.created_at),
					'dd MMMM yyyy',
					{ locale: ru }
				);
				setCurrentDate(formattedDate);
			}

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				setShowDate(false);
			}, 500);
		}
	}, [messages, onLoadMoreMessages]);

	const groupMessagesByDate = (messages: Message[]) => {
		const groupedMessages: { date: string; messages: Message[] }[] = [];

		messages.forEach(message => {
			const messageDate = format(new Date(message.created_at), 'dd MMMM yyyy', {
				locale: ru
			});

			const lastGroup = groupedMessages[groupedMessages.length - 1];

			if (lastGroup && lastGroup.date === messageDate) {
				lastGroup.messages.push(message);
			} else {
				groupedMessages.push({ date: messageDate, messages: [message] });
			}
		});

		return groupedMessages;
	};

	const groupedMessages = groupMessagesByDate(messages);

	return (
		<div className='relative'>
			<div
				className={cn(
					'absolute top-4 left-1/2 transform -translate-x-1/2 py-2 px-4 text-center z-50 rounded transition-opacity duration-300',
					{
						'opacity-0': !showDate,
						'opacity-100': showDate
					}
				)}
			>
				{currentDate}
			</div>
			<ScrollArea
				ref={scrollAreaRef}
				onScroll={handleScroll}
				className='h-[calc(100vh-11rem)] overflow-y-auto'
			>
				<div className='flex flex-col p-4 gap-4'>
					{loading
						? Array.from({ length: 10 }).map((_, index) => (
								<div
									key={index}
									className='flex items-start w-full mb-4'
								>
									<Skeleton className='w-10 h-10 rounded-full mr-2 mt-12' />
									<Skeleton className='flex h-[72px] w-[40%]'></Skeleton>
								</div>
							))
						: groupedMessages.map((group, groupIdx) => (
								<React.Fragment key={groupIdx}>
									<div className='text-center text-gray-500 my-4'>
										{group.date}
									</div>
									{group.messages.map((message, idx) => {
										const isCurrentUser = message.username === currentUser;
										const isSystemMessage = message.type === 'system_message';
										const showAvatar =
											idx === group.messages.length - 1 ||
											group.messages[idx + 1]?.username !== message.username;

										return isSystemMessage ? (
											<div
												key={idx}
												id={`message-${message.id}`}
												className='text-center text-gray-500 my-2'
											>
												{message.content}
											</div>
										) : (
											<div
												key={idx}
												id={`message-${message.id}`}
												className={`flex items-end ${
													isCurrentUser
														? 'flex-row-reverse lg:justify-end'
														: 'justify-start'
												} justify-start w-full`}
											>
												{!isCurrentUser && showAvatar && (
													<Avatar className='mr-2 -my-4'>
														<AvatarFallback>
															{message.username.substring(0, 1)}
														</AvatarFallback>
													</Avatar>
												)}
												<div
													className={cn(
														'p-3 rounded-lg break-all max-w-[70%]',
														isCurrentUser
															? 'bg-blue-600 text-white rounded-br-none lg:rounded-bl-none lg:rounded-br-lg'
															: 'bg-neutral-200 text-black rounded-bl-none',
														!showAvatar && 'ml-12'
													)}
												>
													<div className='mb-1 text-sm opacity-70'>
														<span>{message.username}</span>
														<span className='ml-2'>
															{format(new Date(message.created_at), 'HH:mm', {
																locale: ru
															})}
														</span>
													</div>
													<div className='break-words'>{message.content}</div>
												</div>
												{isCurrentUser && showAvatar && (
													<Avatar
														className={cn('mr-2 -my-4', {
															'hidden lg:block': true
														})}
													>
														<AvatarFallback>
															{message.username.substring(0, 1)}
														</AvatarFallback>
													</Avatar>
												)}
											</div>
										);
									})}
								</React.Fragment>
							))}
				</div>
			</ScrollArea>
		</div>
	);
};
