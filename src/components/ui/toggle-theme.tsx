'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from './buttons';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from './dropdown-menu';

export function ToggleTheme() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='focus-visible:ring-0'
				>
					<SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Изменить тему</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					Светлая
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					Темная
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					Системная
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
