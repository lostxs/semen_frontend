'use client';

import {
	IconAlertTriangle,
	IconCheck,
	IconInfoCircle,
	IconX
} from '@tabler/icons-react';
import { Toaster as Sonner, toast as baseToast } from 'sonner';

export const toast = {
	success: (message: React.ReactNode, duration?: number) => {
		baseToast(
			<div className='flex flex-col items-start'>
				<div className='flex items-center justify-center gap-2 text-emerald-500 font-semibold'>
					<IconCheck size={20} />
					<p>Успешно</p>
				</div>
				<span className='mt-2 text-muted-foreground font-semibold'>
					{message}
				</span>
				<button
					onClick={() => baseToast.dismiss()}
					className='absolute right-2 top-2 rounded-full text-muted-foreground hover:text-inherit'
				>
					<IconX size={16} />
				</button>
			</div>,
			{
				className: 'mx-auto',
				duration: duration
			}
		);
	},
	error: (message: React.ReactNode, duration?: number) => {
		baseToast(
			<div className='flex flex-col items-start'>
				<div className='flex items-center justify-center gap-2 text-destructive font-semibold'>
					<IconAlertTriangle size={20} />
					<p>Произошла ошибка</p>
				</div>
				<span className='mt-2 text-muted-foreground font-semibold'>
					{message}
				</span>
				<button
					onClick={() => baseToast.dismiss()}
					className='absolute right-2 top-2 rounded-full text-muted-foreground hover:text-inherit'
				>
					<IconX size={16} />
				</button>
			</div>,
			{
				className: 'mx-auto',
				duration: duration
			}
		);
	},
	info: (message: React.ReactNode, duration?: number) => {
		baseToast(
			<div className='flex flex-col items-start'>
				<div className='flex items-center justify-center gap-2 text-blue-500 font-semibold'>
					<IconInfoCircle size={20} />
					<p>Уведомление</p>
				</div>
				<span className='mt-2 text-muted-foreground font-semibold'>
					{message}
				</span>
				<button
					onClick={() => baseToast.dismiss()}
					className='absolute right-2 top-2 rounded-full text-muted-foreground hover:text-inherit'
				>
					<IconX size={16} />
				</button>
			</div>,
			{
				className: 'mx-auto',
				duration: duration
			}
		);
	},
	default: (message: React.ReactNode) => {
		baseToast(message, {
			style: {
				border: '1px solid gray',
				backgroundColor: '#e2e3e5',
				color: 'black'
			}
		});
	}
};

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return <Sonner {...props} />;
};

export { Toaster };
