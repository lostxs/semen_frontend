import React from 'react';

import { cn } from '@/lib/utils';

type TitleSize =
	| 'xs'
	| 'sm'
	| 'base'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl';

interface Props {
	size?: TitleSize;
	className?: string;
	text: string;
}

export const Title: React.FC<Props> = ({ size = 'base', className, text }) => {
	const mapTagBySize = {
		xs: 'h5',
		sm: 'h4',
		base: 'h3',
		lg: 'h2',
		xl: 'h1',
		'2xl': 'h1',
		'3xl': 'h1',
		'4xl': 'h1',
		'5xl': 'h1',
		'6xl': 'h1',
		'7xl': 'h1',
		'8xl': 'h1',
		'9xl': 'h1'
	} as const;

	const mapClassNameBySize = {
		xs: 'text-xs',
		sm: 'text-sm',
		base: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl',
		'2xl': 'text-2xl',
		'3xl': 'text-3xl',
		'4xl': 'text-4xl',
		'5xl': 'text-5xl',
		'6xl': 'text-6xl',
		'7xl': 'text-7xl',
		'8xl': 'text-8xl',
		'9xl': 'text-9xl'
	} as const;

	return React.createElement(
		mapTagBySize[size],
		{ className: cn(mapClassNameBySize[size], className) },
		text
	);
};
