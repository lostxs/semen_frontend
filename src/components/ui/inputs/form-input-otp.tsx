'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ErrorText } from '../error-text';

import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';

interface Props {
	name: string;
	length?: number;
	required?: boolean;
	loading?: boolean;
	className?: string;
}

export const FormInputOtp: React.FC<Props> = ({
	name,
	length = 6,
	required = false,
	loading = false,
	className
}) => {
	const {
		register,
		setValue,
		watch,
		formState: { errors }
	} = useFormContext();

	const value = watch(name);

	React.useEffect(() => {
		register(name, { required });
	}, [register, name, required]);

	const handleChange = (value: string) => {
		setValue(name, value, { shouldValidate: true });
	};

	const error = errors[name]?.message;

	return (
		<div className={className}>
			<InputOTPGroup>
				<InputOTP
					disabled={loading}
					maxLength={length}
					value={value || ''}
					onChange={handleChange}
				>
					{Array.from({ length }).map((_, index) => (
						<InputOTPSlot
							key={index}
							index={index}
							className='w-12 h-14 rounded-lg'
						/>
					))}
				</InputOTP>
			</InputOTPGroup>

			{error && (
				<ErrorText
					text={error as string}
					className='mt-2'
				/>
			)}
		</div>
	);
};
