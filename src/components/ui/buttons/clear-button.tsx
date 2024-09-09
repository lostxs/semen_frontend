import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
	onClick?: () => void;
	className?: string;
}

export const ClearButton: React.FC<Props> = ({ onClick, className }) => {
	return (
		<button
			onClick={onClick}
			type='button'
			className={cn(
				'absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer',
				className
			)}
		>
			<X size={18} />
		</button>
	);
};
