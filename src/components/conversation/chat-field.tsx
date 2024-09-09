'use client';

import { IconMoodSmile, IconSend2 } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import React from 'react';

import { Textarea } from '../ui';

import { cn } from '@/lib/utils';

interface Props {
	loading: boolean;
	inputValue: string;
	setInputValue: (value: string) => void;
	onSendMessage: (message: string) => void;
	onTyping: (isTyping: boolean) => void;
}
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export const ChatField: React.FC<Props> = ({
	loading,
	inputValue: message,
	setInputValue: setMessage,
	onSendMessage,
	onTyping
}) => {
	const [isEmojiPickerVisible, setEmojiPickerVisible] = React.useState(false);

	const handleFormSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (message.trim() !== '') {
			onSendMessage(message);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey && message.trim() !== '') {
			event.preventDefault();
			onSendMessage(message);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(event.target.value);
		onTyping(true);
	};

	const handleEmojiClick = (emojiObject: any) => {
		setMessage(message + emojiObject.emoji);
		setEmojiPickerVisible(false);
		onTyping(true);
	};

	return (
		<div className='relative flex-1'>
			<form
				onSubmit={handleFormSubmit}
				className='relative flex items-center dark:bg-neutral-900/70 bg-neutral-200 transition-all h-full'
			>
				<button
					type='button'
					className={cn(
						'ml-4 h-10 w-10 rounded-full flex items-center justify-center text-primary bg-transparent',
						isEmojiPickerVisible ? 'text-primary' : 'text-muted-foreground'
					)}
					onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
				>
					<IconMoodSmile />
				</button>
				<Textarea
					disabled={loading}
					className='border-none resize-none rounded-sm overflow-hidden'
					onKeyDown={handleKeyDown}
					onChange={handleInputChange}
					value={message}
					placeholder='Введите сообщение...'
				/>

				<button
					type='button'
					onClick={() => onSendMessage(message)}
					disabled={message.trim() === '' || loading}
					className='mr-12 h-10 w-10 rounded-full disabled:text-muted-foreground transition duration-200 flex items-center justify-center text-primary bg-transparent'
				>
					<IconSend2 />
				</button>
			</form>
			{isEmojiPickerVisible && (
				<div className='absolute bottom-14 left-10 z-50'>
					<EmojiPicker
						onEmojiClick={handleEmojiClick}
						className='border-none'
					/>
				</div>
			)}
		</div>
	);
};
