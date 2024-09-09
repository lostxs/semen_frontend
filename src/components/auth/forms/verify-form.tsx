'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, ErrorText, FormInputOtp, Title, toast } from '@/components/ui';

import { TFormVerifyValues, formVerifySchema } from './schema';
import { errorCatch } from '@/app/api/error-catch';
import { userService } from '@/app/api/services';

interface Props {
	onSuccess: () => void;
}

export const VerifyForm: React.FC<Props> = ({ onSuccess }) => {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const email = sessionStorage.getItem('email');

	const form = useForm<TFormVerifyValues>({
		resolver: zodResolver(formVerifySchema),
		defaultValues: {
			code: ''
		},
		mode: 'onSubmit'
	});

	const { mutate } = useMutation({
		mutationKey: ['activate'],
		mutationFn: (data: TFormVerifyValues) => userService.activate(data),
		onSuccess: () => {
			sessionStorage.removeItem('email');
			setLoading(false);
			form.reset();
			toast.success('Почта активирована, вы можете войти в аккаунт');
			onSuccess();
		},
		onError: (error: any) => {
			setLoading(false);
			const errorMsg = errorCatch(error);
			setError(errorMsg);
			toast.error(errorMsg);
		}
	});

	const onSubmit = (data: TFormVerifyValues) => {
		setLoading(true);
		mutate(data);
	};

	return (
		<FormProvider {...form}>
			<form
				className='flex flex-col gap-6'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Title
					text='Подтверждение почты'
					size='2xl'
					className='font-semibold ml-2'
				/>

				{email && (
					<p className='text-sm text-gray-500'>Отправлен на: {email}</p>
				)}
				<p className='text-sm text-gray-500'>Код валиден в течение 5 минут</p>

				<FormInputOtp
					loading={loading}
					className='flex flex-col items-center justify-center'
					name='code'
					length={6}
					required
				/>

				<Button
					loading={loading}
					className='h-12 text-base'
					type='submit'
				>
					Подтвердить
				</Button>
			</form>
		</FormProvider>
	);
};
