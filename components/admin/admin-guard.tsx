'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
	children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
	const router = useRouter();
	const { user, isAuthenticated, isRefreshing, _hasHydrated } = useAuthStore();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const checkAuth = async () => {
			console.log('AdminGuard Check:', {
				isAuthenticated,
				isRefreshing,
				_hasHydrated,
				userRole: user?.role,
				userId: user?._id,
			});

			// 0. Wait for hydration
			if (!_hasHydrated) {
				console.log('AdminGuard: Waiting for hydration...');
				return;
			}

			// 1. If explicitly not authenticated and not currently refreshing token -> Login
			if (!isAuthenticated && !isRefreshing) {
				console.log('AdminGuard: Not authenticated, redirecting to login');
				if (mounted) router.replace('/login');
				return;
			}

			// 2. If authenticated, check role
			if (isAuthenticated) {
				if (user?.role !== 'admin') {
					console.log(
						'AdminGuard: User is not admin, redirecting to home. Role:',
						user?.role,
					);
					if (mounted) router.replace('/');
					return;
				}
				// If admin, we are good.
				console.log('AdminGuard: Access granted');
				if (mounted) setIsLoading(false);
			} else {
				// Still refreshing? keep loading
				if (!isRefreshing) {
					if (mounted) setIsLoading(false); // Should have triggered redirect above
				} else {
					console.log('AdminGuard: Refreshing token...');
				}
			}
		};

		checkAuth();

		return () => {
			mounted = false;
		};
	}, [isAuthenticated, user, router, isRefreshing, _hasHydrated]);

	// Show loader while checking, refreshing, or rehydrating
	if (isLoading || isRefreshing || !_hasHydrated) {
		return (
			<div className="flex h-screen w-full items-center justify-center flex-col gap-4">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="text-muted-foreground text-sm">
					{!_hasHydrated ? 'Initializing...' : 'Verifying admin access...'}
				</p>
			</div>
		);
	}

	// Final gate check
	if (!isAuthenticated || user?.role !== 'admin') {
		console.log('AdminGuard: Render gate closed');
		return null;
	}

	return <>{children}</>;
}
