import axios, {
	AxiosRequestConfig,
	AxiosError,
	InternalAxiosRequestConfig,
} from 'axios';
// import { refreshUserToken } from './auth'; // Removed to avoid circular dependency
import { useAuthStore } from '@/store/useAuthStore';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const api = axios.create({
	baseURL,
	withCredentials: true, // Include cookies by default
});

// Request interceptor - add auth token from Zustand store
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = useAuthStore.getState().accessToken;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// let isRefreshing = false; // Using store state instead
let failedQueue: {
	resolve: (token: string) => void;
	reject: (error: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else if (token) {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

// Response interceptor - handle 401 and token refresh
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (!originalRequest) {
			return Promise.reject(error);
		}

		// Only attempt refresh on 401 and if not already retried
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.includes('/auth/refresh')
		) {
			// If already refreshing, queue this request
			// Check store state for refreshing
			if (useAuthStore.getState().isRefreshing) {
				return new Promise<string>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			originalRequest._retry = true;
			// isRefreshing = true;
			useAuthStore.getState().setRefreshing(true);

			try {
				// Get refresh token from store
				const storedRefreshToken = useAuthStore.getState().getRefreshToken();

				// Attempt to refresh token using a clean axios instance to avoid circular dependency
				// We use the same baseURL and withCredentials to ensure cookies are sent if used
				const response = await axios.post(
					`${baseURL}/api/v1/auth/refresh`,
					storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
					{
						withCredentials: true,
						headers: { Authorization: '' }, // Do not send potentially expired access token
					},
				);

				const { accessToken, refreshToken, expiresIn } = response.data.data;

				// Update Zustand store with new tokens
				useAuthStore.getState().setAccessToken(accessToken, expiresIn);
				if (refreshToken) {
					useAuthStore.getState().setRefreshToken(refreshToken);
				}

				// Refresh the middleware cookie
				document.cookie = `isAuthenticated=true; path=/; max-age=${expiresIn || 86400}`;

				// Update default header
				api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

				// Process queued requests
				processQueue(null, accessToken);
				// isRefreshing = false;
				useAuthStore.getState().setRefreshing(false);

				// Retry original request
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				// Refresh failed - logout user
				processQueue(refreshError as Error, null);
				// isRefreshing = false;
				useAuthStore.getState().setRefreshing(false);

				// Clear auth state
				useAuthStore.getState().logout();

				// Clear cookie manually to be safe
				document.cookie =
					'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

				// Redirect to login page only if not already there
				if (
					typeof window !== 'undefined' &&
					!window.location.pathname.includes('/login')
				) {
					window.location.href = '/login';
				}

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

// Helper functions for API calls
export const setHeaderAuthorization = (token?: string): void => {
	if (token) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common.Authorization;
	}
};

export const postData = <TPayload, TResponse>(
	url: string,
	data?: TPayload,
	options?: AxiosRequestConfig,
): ApiRequestResponseType<TResponse> => {
	return api.post(url, data, options);
};

export const getData = <TResponse>(
	url: string,
	options?: AxiosRequestConfig,
): ApiRequestResponseType<TResponse> => {
	return api.get(url, options);
};

export const putData = <TPayload, TResponse>(
	url: string,
	data?: TPayload,
	options?: AxiosRequestConfig,
): ApiRequestResponseType<TResponse> => {
	return api.put(url, data, options);
};

export const patchData = <TPayload, TResponse>(
	url: string,
	data?: TPayload,
	options?: AxiosRequestConfig,
): ApiRequestResponseType<TResponse> => {
	return api.patch(url, data, options);
};

export const deleteData = <TResponse>(
	url: string,
	options?: AxiosRequestConfig,
): ApiRequestResponseType<TResponse> => {
	return api.delete(url, options);
};
export default api;
