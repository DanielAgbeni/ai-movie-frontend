'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { getSocket, disconnectSocket } from '@/lib/socket';
import {
	notificationKeys,
	useUnreadCountQuery,
} from '@/hooks/useNotifications';

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const { accessToken, isAuthenticated } = useAuthStore();
	const {
		addNotification,
		incrementUnreadCount,
		setConnected,
		reset: resetNotifications,
	} = useNotificationStore();
	const socketInitialized = useRef(false);

	// Fetch initial unread count on mount/auth
	useUnreadCountQuery();

	useEffect(() => {
		// Only connect if authenticated with a valid token
		if (!isAuthenticated || !accessToken) {
			disconnectSocket();
			setConnected(false);
			resetNotifications();
			socketInitialized.current = false;
			return;
		}

		// Avoid re-initializing if already connected
		if (socketInitialized.current) {
			return;
		}

		const socket = getSocket(accessToken);
		socketInitialized.current = true;

		socket.on('connect', () => {
			console.log('[Socket] Connected');
			setConnected(true);
		});

		socket.on('disconnect', () => {
			console.log('[Socket] Disconnected');
			setConnected(false);
		});

		socket.on('notification', (notification: AppNotification) => {
			console.log('[Socket] New notification:', notification);
			// Add to local state for immediate UI update
			addNotification(notification);
			incrementUnreadCount();
			// Invalidate queries to ensure cache is fresh
			queryClient.invalidateQueries({ queryKey: notificationKeys.all });
		});

		socket.on('error', (error) => {
			console.error('[Socket] Error:', error);
		});

		// Cleanup on unmount or when auth changes
		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('notification');
			socket.off('error');
		};
	}, [
		isAuthenticated,
		accessToken,
		addNotification,
		incrementUnreadCount,
		setConnected,
		resetNotifications,
		queryClient,
	]);

	// Cleanup on logout
	useEffect(() => {
		if (!isAuthenticated) {
			disconnectSocket();
			socketInitialized.current = false;
		}
	}, [isAuthenticated]);

	return <>{children}</>;
}
