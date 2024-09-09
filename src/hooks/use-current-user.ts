import { useQuery } from '@tanstack/react-query';

import { userService } from '@/app/api/services';

export function useCurrentUser() {
	const { data, isLoading } = useQuery({
		queryKey: ['currentUser'],
		queryFn: () => userService.getCurrentUser()
	});

	return { data, isLoading };
}
