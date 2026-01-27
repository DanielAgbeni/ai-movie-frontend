import { getData, postData, patchData, deleteData } from './index';
import './types';

/**
 * Get trending movies
 */
export const getTrendingMovies = (params?: {
	limit?: number;
}): ApiRequestResponseType<TrendingResponse> => {
	return getData('/api/v1/trending', { params });
};

export const searchMovies = (params: {
	q: string;
	limit?: number;
}): ApiRequestResponseType<MovieListResponse> => {
	return getData('/api/v1/movies/search', { params });
};

export const getMovieById = (
	id: string,
): ApiRequestResponseType<{ movie: Movie }> => {
	return getData(`/api/v1/movies/${id}`);
};

export const getCategories = (): ApiRequestResponseType<CategoryResponse> => {
	return getData('/api/v1/categories');
};

export const getBrowseMovies = (params?: {
	sort?: string;
	page?: number;
	cursor?: string;
	limit?: number;
	categories?: string;
	type?: 'free' | 'premium';
}): ApiRequestResponseType<Movie[]> => {
	return getData('/api/v1/browse', { params });
};

export const createMovie = (
	data: CreateMovieRequest,
): ApiRequestResponseType<{ movie: Movie }> => {
	return postData('/api/v1/movies', data);
};

export const getMoviePlayback = (
	id: string,
): ApiRequestResponseType<{ playback: PlaybackInfo }> => {
	return getData(`/api/v1/movies/${id}/playback`);
};

// Creator API endpoints
export const getCreatorMovies = (params?: {
	limit?: number;
	cursor?: string;
}): ApiRequestResponseType<{ movies: Movie[] }> => {
	return getData('/api/v1/creator/movies', { params });
};

export const getCreatorMovieById = (
	id: string,
): ApiRequestResponseType<{ movie: Movie }> => {
	return getData(`/api/v1/creator/movies/${id}`);
};

export const updateCreatorMovie = (
	id: string,
	data: UpdateMovieRequest,
): ApiRequestResponseType<{ movie: Movie }> => {
	return patchData(`/api/v1/creator/movies/${id}`, data);
};

export const deleteCreatorMovie = (
	id: string,
): ApiRequestResponseType<{ message: string }> => {
	return deleteData(`/api/v1/creator/movies/${id}`);
};
