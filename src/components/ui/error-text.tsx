import { cn } from '@/lib/utils';

interface Props {
	text: string;
	className?: string;
}

export const ErrorText: React.FC<Props> = ({ text, className }) => {
	return <p className={cn('text-destructive text-sm', className)}>{text}</p>;
};
