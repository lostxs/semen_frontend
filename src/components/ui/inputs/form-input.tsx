'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ClearButton, ShowPassword } from '../buttons';
import { ErrorText } from '../error-text';
import { RequiredSymbol } from '../required-symbol';

import { Input } from './input';
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	required?: boolean;
	showClearButton?: boolean;
	showPasswordToggle?: boolean;
	className?: string;
}

export const FormInput: React.FC<Props> = ({
	name,
	label,
	required,
	showClearButton = true,
	showPasswordToggle = false,
	className,
	type = 'text',
	...props
}) => {
	const [passwordVisible, setPasswordVisible] = React.useState(false);
	const {
		register,
		setValue,
		watch,
		formState: { errors }
	} = useFormContext();

	const value = watch(name);
	const getErrorText = (errors: any, namePath: string[]) => {
		return namePath.reduce((acc, curr) => {
			if (acc && typeof acc === 'object') {
				return acc[curr];
			}
			return undefined;
		}, errors);
	};
	let errorText = getErrorText(errors, name.split('.'));

	if (errorText && typeof errorText === 'object') {
		errorText = errorText.message;
	}

	const onClickClear = () => {
		setValue(name, '', { shouldValidate: true });
	};

	const onClickShowPassword = () => {
		setPasswordVisible(!passwordVisible); // переключаем видимость пароля
	};

	return (
		<div className={className}>
			{label && (
				<p className={cn('text-sm mb-1 ml-2', { 'text-red-500': errorText })}>
					{label} {required && <RequiredSymbol />}
				</p>
			)}

			<div className='relative'>
				<Input
					className='h-12 text-base'
					type={passwordVisible ? 'text' : type}
					{...register(name)}
					{...props}
				/>
				{showClearButton && value && <ClearButton onClick={onClickClear} />}
				{showPasswordToggle && value && type === 'password' && (
					<ShowPassword onClick={onClickShowPassword} />
				)}
			</div>

			{errorText && (
				<ErrorText
					text={errorText}
					className='mt-2'
				/>
			)}
		</div>
	);
};
