import * as z from 'zod';

export const formLoginSchema = z.object({
	username: z.string().min(1, 'Обязательное поле'),
	password: z.string().min(1, 'Обязательное поле')
});
export type TFormLoginValues = z.infer<typeof formLoginSchema>;

export const formRegisterSchema = z
	.object({
		username: z.string().min(1, 'Обязательное поле'),
		email: z
			.string()
			.email({ message: 'Некорректная почта' })
			.min(1, 'Обязательное поле'),
		password: z
			.string()
			.min(6, 'Пароль должен быть не менее 6 символов')
			.regex(
				/[!@#$%^&*(),.?":{}|<>]/,
				'Пароль должен содержать хотя бы один специальный символ'
			),
		confirmPassword: z.string().min(6, 'Пароль должен быть не менее 6 символов')
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли должны совпадать',
		path: ['confirmPassword']
	});

export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;

export const formVerifySchema = z.object({
	code: z.string().min(6, 'Обязательное поле')
});

export type TFormVerifyValues = z.infer<typeof formVerifySchema>;
