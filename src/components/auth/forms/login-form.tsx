'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, ErrorText, FormInput, Title, toast } from '@/components/ui';

import { TFormLoginValues, formLoginSchema } from './schema';
import { errorCatch } from '@/app/api/error-catch';
import { authService, getAccessToken } from '@/app/api/services';
import { useWebSocket } from '@/hooks';

export const LoginForm = () => {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const { connect } = useWebSocket();
	const router = useRouter();

	const form = useForm<TFormLoginValues>({
		resolver: zodResolver(formLoginSchema),
		defaultValues: {
			username: '',
			password: ''
		}
	});

	const { mutate } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: TFormLoginValues) => authService.login(data),
		onSuccess: () => {
			setLoading(false);
			form.reset();
			toast.success('Вы вошли в аккаунт');
			router.push('/conversation');

			const token = getAccessToken();
			if (token) {
				connect(token);
			}
		},
		onError: (error: any) => {
			setLoading(false);
			const errorMsg = errorCatch(error);
			setError(errorMsg);
			toast.error(errorMsg);
		}
	});

	const onSubmit = (data: TFormLoginValues) => {
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
					text='Войти в аккаунт'
					size='2xl'
					className='font-semibold ml-2'
				/>

				<FormInput
					disabled={loading}
					name='username'
					label='Имя пользователя'
					required
				/>
				<FormInput
					disabled={loading}
					name='password'
					label='Пароль'
					type='password'
					required
				/>

				<Button
					loading={loading}
					className='h-12 text-base mt-2'
					type='submit'
				>
					Войти
				</Button>
			</form>
		</FormProvider>
	);
};
