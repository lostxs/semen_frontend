'use client';

import { IconEye, IconEyeOff } from '@tabler/icons-react';
import React from 'react';

import { cn } from '@/lib/utils';

interface Props {
	onClick?: () => void;
	className?: string;
}

export const ShowPassword: React.FC<Props> = ({ onClick, className }) => {
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

	const handleToggleVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible); // Переключаем состояние
		if (onClick) onClick(); // Вызываем onClick если передан
	};

	return (
		<button
			onClick={handleToggleVisibility}
			type='button'
			className={cn(
				'absolute right-10 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer',
				className
			)}
		>
			{isPasswordVisible ? <IconEyeOff size={18} /> : <IconEye size={18} />}{' '}
			{/* Переключаем иконки */}
		</button>
	);
};
