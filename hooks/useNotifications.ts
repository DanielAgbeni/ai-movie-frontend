'use client';

import {
	useQuery,
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from '@tanstack/react-query';
import {
	getNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	getNotificationPreferences,
	updateNotificationPreferences,
	type GetNotificationsParams,
} from '@/api/notifications';
import { useNotificationStore } from '@/store/useNotificationStore';

// Query Keys
export const notificationKeys = {
	all: ['notifications'] as const,
	list: (params?: GetNotificationsParams) =>
		[...notificationKeys.all, 'list', params] as const,
	preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

// Hook to fetch paginated notifications
export function useNotifications(limit: number = 10) {
	const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

	return useInfiniteQuery({
		queryKey: notificationKeys.list({ limit }),
		queryFn: async ({ pageParam = 1 }) => {
			const response = await getNotifications({ page: pageParam, limit });
			const data = response?.data?.data;
			// Update unread count from backend response
			if (data?.unreadCount !== undefined) {
				setUnreadCount(data.unreadCount);
			}
			return data;
		},
		getNextPageParam: (lastPage) => {
			// Backend returns: { page, totalPages, ... } at root level
			if (!lastPage) return undefined;
			const currentPage = lastPage.page ?? 1;
			const totalPages = lastPage.totalPages ?? 0;
			if (currentPage < totalPages) {
				return currentPage + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
	});
}

// Hook to mark a single notification as read
export function useMarkAsRead() {
	const queryClient = useQueryClient();
	const { decrementUnreadCount, markAsRead } = useNotificationStore();

	return useMutation({
		mutationFn: (id: string) => markNotificationAsRead(id),
		onMutate: async (id: string) => {
			// Optimistic update
			markAsRead(id);
			decrementUnreadCount();
		},
		onSuccess: () => {
			// Invalidate to sync with server
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
		onError: () => {
			// On error, refetch to get correct state
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}

// Hook to mark all notifications as read
export function useMarkAllAsRead() {
	const queryClient = useQueryClient();
	const { markAllAsRead, resetUnreadCount } = useNotificationStore();

	return useMutation({
		mutationFn: () => markAllNotificationsAsRead(),
		onMutate: async () => {
			// Optimistic update
			markAllAsRead();
			resetUnreadCount();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
		onError: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		},
	});
}

// Hook to fetch notification preferences (Creators only)
export function useNotificationPreferences() {
	return useQuery({
		queryKey: notificationKeys.preferences(),
		queryFn: async () => {
			const response = await getNotificationPreferences();
			return response?.data?.data;
		},
	});
}

// Hook to update notification preferences
export function useUpdateNotificationPreferences() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<NotificationPreferences>) =>
			updateNotificationPreferences(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: notificationKeys.preferences(),
			});
		},
	});
}
// Hook to fetch initial unread count
export function useUnreadCountQuery() {
	const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

	return useQuery({
		queryKey: notificationKeys.list({ limit: 1 }), // Minimal fetch
		queryFn: async () => {
			const response = await getNotifications({ limit: 1 });
			const data = response?.data?.data;
			if (data?.unreadCount !== undefined) {
				setUnreadCount(data.unreadCount);
			}
			return data;
		},
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	});
}
