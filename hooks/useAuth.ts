import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser, logoutUser } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { AxiosError } from 'axios';

type ApiError = {
	success: false;
	message: string;
	code?: string;
};

/**
 * Hook for user login mutation
 */
export const useLogin = () => {
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: loginUser,
		onSuccess: (response) => {
			setAuth(response.data.data);
			// Set a cookie for middleware to check (not for security, just for routing)
			document.cookie = `isAuthenticated=true; path=/; max-age=${response.data.data.expiresIn || 86400}`;
		},
		onError: (error: AxiosError<ApiError>) => {
			console.error(
				'Login failed:',
				error.response?.data?.message || error.message,
			);
		},
	});
};

/**
 * Hook for user registration mutation
 */
export const useRegister = () => {
	return useMutation({
		mutationFn: registerUser,
		onError: (error: AxiosError<ApiError>) => {
			console.error(
				'Registration failed:',
				error.response?.data?.message || error.message,
			);
		},
	});
};

/**
 * Hook for logout action
 */
export const useLogout = () => {
	const logout = useAuthStore((state) => state.logout);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			logout();
			queryClient.clear(); // Clear all cached queries on logout
			// Remove the middleware cookie
			document.cookie =
				'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		},
		onError: () => {
			// Even if backend logout fails, clear local state
			logout();
			queryClient.clear();
			document.cookie =
				'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		},
	});
};
