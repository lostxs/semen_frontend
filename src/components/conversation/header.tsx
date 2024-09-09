import { Title, ToggleTheme } from '../ui';

interface Props {
	onlineUsers: string[];
	typingUsers: string[];
}

export const Header: React.FC<Props> = ({ onlineUsers, typingUsers }) => {
	return (
		<div className='flex items-center justify-between p-4 rounded-br-sm border-b'>
			<div className='flex flex-col gap-1'>
				<Title
					text='Публичный чат'
					size='xl'
					className='font-semibold'
				/>
				<div className='flex flex-row gap-1'>
					<p className='text-sm text-neutral-500'>
						онлайн: {onlineUsers.length}
					</p>
					<span className='relative flex h-[10px] w-[10px]'>
						<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
						<span className='relative inline-flex rounded-full h-[10px] w-[10px] bg-emerald-500'></span>
					</span>
					{typingUsers.length > 0 && (
						<p className='text-sm text-neutral-500 ml-2'>
							{typingUsers.join(', ')} печатает...
						</p>
					)}
				</div>
			</div>
			<ToggleTheme />
		</div>
	);
};
