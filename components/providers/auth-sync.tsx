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
		}
	}, [isAuthenticated, expiresIn]);

	return null;
}
