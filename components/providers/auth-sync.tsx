'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Component to synchronize auth state with cookies
 * This ensures that if the user is authenticated in the client store,
 * the middleware cookie is also present.
 */
export function AuthSync() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const expiresIn = useAuthStore((state) => state.expiresIn);
	const updateUser = useAuthStore((state) => state.updateUser);

	// Sync cookie
	useEffect(() => {
		// If the user is authenticated in the client store
		if (isAuthenticated) {
			// Check if the cookie exists
			const hasCookie = document.cookie.includes('isAuthenticated=true');

			// If cookie is missing or we just want to ensure it's fresh
			if (!hasCookie) {
				// Restore the cookie
				// We use the stored expiresIn or default to 1 day
				document.cookie = `isAuthenticated=true; path=/; max-age=${expiresIn || 86400}`;
			}
		} else {
			// Remove cookie if user is not authenticated
			document.cookie =
				'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	}, [isAuthenticated, expiresIn]);

	// Sync user data (check if verified etc)
	useEffect(() => {
		if (!isAuthenticated) return;

		const checkAuth = async () => {
			try {
				const { getMe } = await import('@/api/auth');
				const { data } = await getMe();
				if (data.data?.user) {
					updateUser(data.data.user);
				}
			} catch (error) {
				console.error('Failed to refresh user data', error);
			}
		};

		// Check immediately
		checkAuth();

		// Check on focus
		const onFocus = () => checkAuth();
		window.addEventListener('focus', onFocus);

		return () => window.removeEventListener('focus', onFocus);
	}, [isAuthenticated, updateUser]);

	return null;
}
