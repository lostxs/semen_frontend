'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, ErrorText, FormInput, Title, toast } from '@/components/ui';

import { TFormRegisterValues, formRegisterSchema } from './schema';
import { errorCatch } from '@/app/api/error-catch';
import { userService } from '@/app/api/services';

interface Props {
	onSuccess: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSuccess }) => {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const form = useForm<TFormRegisterValues>({
		resolver: zodResolver(formRegisterSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	});

	const { mutate } = useMutation({
		mutationKey: ['register'],
		mutationFn: (data: TFormRegisterValues) => userService.register(data),
		onSuccess: () => {
			sessionStorage.setItem('email', form.getValues('email'));
			setLoading(false);
			form.reset();
			onSuccess();
		},
		onError: (error: any) => {
			setLoading(false);
			const errorMsg = errorCatch(error);
			setError(errorMsg);
			toast.error(errorMsg);
		}
	});

	const onSubmit = (data: TFormRegisterValues) => {
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
					text='Создать аккаунт'
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
					name='email'
					label='Email'
					required
				/>
				<FormInput
					disabled={loading}
					name='password'
					label='Пароль'
					type='password'
					showPasswordToggle={true}
					required
				/>
				<FormInput
					disabled={loading}
					name='confirmPassword'
					label='Подтвердите пароль'
					type='password'
					showPasswordToggle={true}
					required
				/>

				<Button
					loading={loading}
					className='h-12 text-base mt-2'
					type='submit'
				>
					Регистрация
				</Button>
			</form>
		</FormProvider>
	);
};
