import api from './index';
import './types';

/**
 * Login user with email and password
 */
export const loginUser = (credentials: LoginCredentials) => {
	return api.post<ApiResponse<LoginResponseData>>(
		'/api/v1/auth/login',
		credentials,
		{
			withCredentials: true, // Include cookies for refresh token
		},
	);
};

/**
 * Register a new user
 */
export const registerUser = (data: RegisterData) => {
	return api.post<ApiResponse<RegisterResponseData>>(
		'/api/v1/auth/register',
		data,
	);
};

/**
 * Refresh access token using the refresh token
 * @param refreshToken - The refresh token returned from login (optional, falls back to cookie)
 */
export const refreshUserToken = (refreshToken?: string) => {
	return api.post<ApiResponse<RefreshTokenResponseData>>(
		'/api/v1/auth/refresh',
		refreshToken ? { refreshToken } : {},
		{
			withCredentials: true, // Include cookies as fallback
			headers: { Authorization: '' }, // Do not send expired access token
		},
	);
};

/**
 * Logout user - invalidates refresh token on backend and clears cookie
 * Backend returns 204 No Content
 */
export const logoutUser = () => {
	return api.post(
		'/api/v1/auth/logout',
		{},
		{
			withCredentials: true, // Include cookies so backend can read refreshToken
		},
	);
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = (email: string) => {
	return api.post('/api/v1/auth/resend-verification', { email });
};
