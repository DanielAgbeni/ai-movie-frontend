import api from '.';

export type AdminStats = {
	movies: number;
	comments: number;
	orders: any[]; // Define more specifically if needed based on backend response
	totalRevenueCents: number;
};

export type AdminAnalyticsData = {
	users: { _id: string; count: number }[];
	videos: { _id: string; count: number }[];
	revenue: { _id: string; amount: number }[];
};

export type AdminAnalyticsResponse = {
	period: string;
	analytics: AdminAnalyticsData;
};

export type AdminUserListResponse = {
	users: User[];
	pagination: PaginationType;
};

export type AdminMovieListResponse = {
	movies: Movie[]; // Reusing Movie type from ./types (which is global) or ./index
	pagination: PaginationType;
};

export type AdminComment = {
	_id: string;
	userId: {
		_id: string;
		email: string;
	};
	movieId: string;
	body: string;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	stats?: {
		likesCount: number;
		repliesCount: number;
	};
	parentId?: string;
	rootId?: string;
	depth?: number;
	deletedAt?: string;
	deletedBy?: string;
};

export type AdminCommentListResponse = {
	comments: AdminComment[];
	pagination: PaginationType;
};

// --- API Functions ---

// Stats & Analytics
export const getAdminStats = (): ApiRequestResponseType<{
	stats: AdminStats;
}> => {
	return api.get('/api/v1/admin/stats');
};

export const getAdminAnalytics = (
	period: 'week' | 'month' | '6months' | 'year' = 'month',
): ApiRequestResponseType<AdminAnalyticsResponse> => {
	return api.get(`/api/v1/admin/stats/analytics?period=${period}`);
};

// User Management
export const getAdminUsers = (
	cursor?: string,
	limit: number = 20,
): ApiRequestResponseType<{
	users: User[];
	hasMore: boolean;
	nextCursor?: string;
}> => {
	let url = `/api/v1/admin/users?limit=${limit}`;
	if (cursor) url += `&cursor=${cursor}`;
	return api.get(url);
};

export const updateUserRole = (
	id: string,
	role: 'user' | 'creator' | 'admin',
): ApiRequestResponseType<{ user: User }> => {
	return api.patch(`/api/v1/admin/users/${id}/role`, { role });
};

export const suspendUser = (
	id: string,
): ApiRequestResponseType<{ user: User }> => {
	return api.patch(`/api/v1/admin/users/${id}/suspend`);
};

export const unsuspendUser = (
	id: string,
): ApiRequestResponseType<{ user: User }> => {
	return api.patch(`/api/v1/admin/users/${id}/unsuspend`);
};

// Movie Management
export const getAdminMovies = (
	cursor?: string,
	limit: number = 20,
	status: 'all' | 'active' | 'deleted' = 'all',
): ApiRequestResponseType<{
	movies: Movie[];
	hasMore: boolean;
	nextCursor?: string;
}> => {
	let url = `/api/v1/admin/movies?limit=${limit}&status=${status}`;
	if (cursor) url += `&cursor=${cursor}`;
	return api.get(url);
};

export const takedownMovie = (
	id: string,
): ApiRequestResponseType<{ movie: Movie }> => {
	return api.patch(`/api/v1/admin/movies/${id}/takedown`);
};

export const restoreMovie = (
	id: string,
): ApiRequestResponseType<{ movie: Movie }> => {
	return api.patch(`/api/v1/admin/movies/${id}/restore`);
};

// Comment Management
export const getAdminComments = (
	cursor?: string,
	limit: number = 20,
	status: 'all' | 'active' | 'deleted' = 'all',
): ApiRequestResponseType<{
	comments: AdminComment[];
	hasMore: boolean;
	nextCursor?: string;
}> => {
	let url = `/api/v1/admin/comments?limit=${limit}&status=${status}`;
	if (cursor) url += `&cursor=${cursor}`;
	return api.get(url);
};

export const takedownComment = (
	id: string,
): ApiRequestResponseType<{ comment: AdminComment }> => {
	return api.patch(`/api/v1/admin/comments/${id}/takedown`);
};
