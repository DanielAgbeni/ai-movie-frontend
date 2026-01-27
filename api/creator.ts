import api from './index';
import './types';

/**
 * Set up creator profile for the authenticated user
 */
export const setupCreatorProfile = (data: SetupCreatorProfileInput) => {
	return api.post<ApiResponse<CreatorProfileResponse>>(
		'/api/v1/creator/profile',
		data,
		{
			withCredentials: true,
		},
	);
};

/**
 * Get creator profile for the authenticated user
 */
export const getCreatorProfile = () => {
	return api.get<ApiResponse<CreatorProfileResponse>>(
		'/api/v1/creator/profile',
		{
			withCredentials: true,
		},
	);
};

/**
 * Update creator profile
 */
export const updateCreatorProfile = (data: UpdateCreatorProfileInput) => {
	return api.patch<ApiResponse<CreatorProfileResponse>>(
		'/api/v1/creator/profile',
		data,
		{
			withCredentials: true,
		},
	);
};

/**
 * Get public creator details by ID
 */
export const getCreatorById = (id: string) => {
	return api.get<ApiResponse<{ creator: CreatorProfile }>>(
		`/api/v1/creators/${id}`,
	);
};

/**
 * Get public creator videos by ID
 */
export const getCreatorVideos = (
	id: string,
	params?: { page?: number; limit?: number; sort?: string },
) => {
	return api.get<ApiResponse<CreatorPublicVideosResponse>>(
		`/api/v1/creators/${id}/videos`,
		{ params },
	);
};
