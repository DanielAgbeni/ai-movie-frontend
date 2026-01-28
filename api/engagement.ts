import { getData, postData, deleteData } from './index';

// Engagement Types
export type LikeStatusResponse = {
	liked: boolean;
};

export type DislikeStatusResponse = {
	disliked: boolean;
};

export type SubscribeStatusResponse = {
	subscribed: boolean;
};

export type ViewResponse = {
	recorded: boolean;
	sessionId: string;
};

// Comment Types
export type CommentUser = {
	_id: string;
	email: string;
	name?: string;
	avatarUrl?: string;
};

export type Comment = {
	_id: string;
	movieId: string;
	userId: CommentUser;
	body: string;
	parentId?: string;
	rootId?: string;
	depth: number;
	stats: {
		likesCount: number;
		repliesCount: number;
	};
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CommentListResponse = Comment[];

// ----------------------------------------------------------------------
// Movie Engagement
// ----------------------------------------------------------------------

export const likeMovie = (
	id: string,
): ApiRequestResponseType<{ liked: boolean }> => {
	return postData(`/api/v1/movies/${id}/like`, {});
};

export const unlikeMovie = (id: string): ApiRequestResponseType<void> => {
	return deleteData(`/api/v1/movies/${id}/like`);
};

export const getLikeStatus = (
	id: string,
): ApiRequestResponseType<LikeStatusResponse> => {
	return getData(`/api/v1/movies/${id}/like/status`);
};

export const dislikeMovie = (
	id: string,
): ApiRequestResponseType<{ disliked: boolean }> => {
	return postData(`/api/v1/movies/${id}/dislike`, {});
};

export const undislikeMovie = (id: string): ApiRequestResponseType<void> => {
	return deleteData(`/api/v1/movies/${id}/dislike`);
};

export const getDislikeStatus = (
	id: string,
): ApiRequestResponseType<DislikeStatusResponse> => {
	return getData(`/api/v1/movies/${id}/dislike/status`);
};

export const recordView = (
	id: string,
	sessionId?: string,
	watchDurationSec?: number,
): ApiRequestResponseType<ViewResponse> => {
	return postData(`/api/v1/movies/${id}/view`, { sessionId, watchDurationSec });
};

// ----------------------------------------------------------------------
// Creator Subscription
// ----------------------------------------------------------------------

export const subscribeToCreator = (
	id: string,
): ApiRequestResponseType<{ subscribed: boolean }> => {
	return postData(`/api/v1/creators/${id}/subscribe`, {});
};

export const unsubscribeFromCreator = (
	id: string,
): ApiRequestResponseType<void> => {
	return deleteData(`/api/v1/creators/${id}/subscribe`);
};

export const getSubscriptionStatus = (
	id: string,
): ApiRequestResponseType<SubscribeStatusResponse> => {
	return getData(`/api/v1/creators/${id}/subscribe/status`);
};

// ----------------------------------------------------------------------
// Comments
// ----------------------------------------------------------------------

export const getComments = (
	movieId: string,
	params?: { cursor?: string; limit?: number },
): ApiRequestResponseType<CommentListResponse> => {
	return getData(`/api/v1/movies/${movieId}/comments`, { params });
};

export const createComment = (
	movieId: string,
	body: string,
	parentId?: string,
): ApiRequestResponseType<{ comment: Comment }> => {
	return postData(`/api/v1/movies/${movieId}/comments`, { body, parentId });
};

export const getReplies = (
	commentId: string,
	params?: { cursor?: string; limit?: number },
): ApiRequestResponseType<CommentListResponse> => {
	return getData(`/api/v1/comments/${commentId}/replies`, { params });
};

export const deleteComment = (
	commentId: string,
): ApiRequestResponseType<void> => {
	return deleteData(`/api/v1/comments/${commentId}`);
};

export const likeComment = (
	commentId: string,
): ApiRequestResponseType<{ liked: boolean }> => {
	return postData(`/api/v1/comments/${commentId}/like`, {});
};

export const unlikeComment = (
	commentId: string,
): ApiRequestResponseType<void> => {
	return deleteData(`/api/v1/comments/${commentId}/like`);
};

// ----------------------------------------------------------------------
// Watch Progress
// ----------------------------------------------------------------------

export const saveWatchProgress = (
	movieId: string,
	progressSeconds: number,
	totalDurationSeconds: number,
): ApiRequestResponseType<WatchProgressResponse> => {
	return postData(`/api/v1/movies/${movieId}/watch`, {
		progressSeconds,
		totalDurationSeconds,
	});
};

export const getWatchProgress = (
	movieId: string,
): ApiRequestResponseType<WatchProgressResponse> => {
	return getData(`/api/v1/movies/${movieId}/watch`);
};

export const getWatchHistory = (params?: {
	page?: number;
	limit?: number;
}): ApiRequestResponseType<WatchHistoryResponse> => {
	return getData(`/api/v1/engagement/history`, { params });
};

export const getLikedVideos = (params?: {
	page?: number;
	limit?: number;
}): ApiRequestResponseType<LikedVideosResponse> => {
	return getData(`/api/v1/engagement/liked`, { params });
};

export const getSubscriptions = (params?: {
	page?: number;
	limit?: number;
}): ApiRequestResponseType<SubscriptionsResponse> => {
	return getData(`/api/v1/engagement/subscriptions`, { params });
};
