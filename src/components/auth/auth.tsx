'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Button, toast } from '../ui';

import { LoginForm, RegisterForm, VerifyForm } from './forms';

export const Auth = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [type, setType] = React.useState<'login' | 'register' | 'activate'>(
		'login'
	);

	const onChangeType = () => {
		setType(prev => (prev === 'login' ? 'register' : 'login'));
	};

	const onRegisterSuccess = () => {
		setType('activate');
	};

	const onActivateSuccess = () => {
		setType('login');
	};

	React.useEffect(() => {
		let toastMessage = '';
		const hash = window.location.hash;

		if (hash === '#not-auth') {
			toastMessage = 'Сеанс истек. Войдите заново.';
			router.replace('/');
		}

		if (toastMessage) {
			setTimeout(() => {
				toast.info(toastMessage, 5000);
			}, 100);
		}
	}, []);

	return (
		<div className='relative w-[500px] shadow-sm rounded-md dark:bg-secondary/10 bg-background py-6 px-10 flex flex-col'>
			{type === 'login' && <LoginForm />}
			{type === 'register' && <RegisterForm onSuccess={onRegisterSuccess} />}

			{type === 'activate' && <VerifyForm onSuccess={onActivateSuccess} />}

			<Button
				onClick={onChangeType}
				variant='link'
				className='mt-4'
			>
				{type === 'login' ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Войти'}
			</Button>
		</div>
	);
};
