import { AxiosResponse } from 'axios';

declare global {
	export type MetaType = {
		nextLink: string | null;
		previousLink: string | null;
		presentLink: string | null;
	};

	export type PaginationType = {
		presentPage: number;
		total: number;
		limit: number;
		previousPage: number | null;
		nextPage: number | null;
		totalPage: number;
	};

	export type ResultPaginationType = {
		meta: MetaType;
		pagination: PaginationType;
	};

	export type AuthDetailsType = {
		type: 'Bearer';
		token: string;
	};

	// API Response wrapper
	export interface ApiResponse<T = any> {
		success: boolean;
		message: string;
		data: T;
		code?: string;
		meta?: {
			pagination?: {
				hasMore: boolean;
				nextCursor?: string;
				total?: number;
			};
		};
	}

	export type ApiRequestResponseType<T> = Promise<
		AxiosResponse<ApiResponse<T>>
	>;

	// User type from API
	export type User = {
		_id: string;
		email: string;
		role: 'user' | 'admin' | 'creator';
		emailVerified: boolean;
		emailVerificationExpires?: string;
		createdAt: string;
		updatedAt: string;
		lastLoginAt?: string;
		avatarUrl?: string;
		__v?: number;
	};

	// Auth request/response types
	export type LoginCredentials = {
		email: string;
		password: string;
	};

	export type RegisterData = {
		email: string;
		password: string;
		confirmPassword?: string;
	};

	export type LoginResponseData = {
		user: User;
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
	};

	export type RegisterResponseData = {
		user: User;
	};

	export type RefreshTokenResponseData = {
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
	};

	export type MovieImage = {
		publicId: string;
		url: string;
		secureUrl: string;
	};

	export type MuxPlayback = {
		assetId?: string;
		playbackId?: string;
		uploadId?: string;
		processingStatus?: 'pending' | 'processing' | 'ready' | 'errored';
		durationSec?: number;
	};

	export type MoviePricing = {
		currency: string;
		rentPriceCents: number;
		buyPriceCents: number;
		rentDurationHours: number;
	};

	export type MovieStats = {
		viewsCount: number;
		likesCount: number;
		commentsCount: number;
		avgRating: number;
		ratingCount: number;
	};

	export type MovieCreator = {
		_id: string;
		displayName: string;
		bio: string;
		avatarUrl: string;
		bannerUrl: string;
		isVerified: boolean;
	};

	export type Movie = {
		_id: string;
		creatorId: MovieCreator;
		title: string;
		description: string;
		slug: string;
		visibility: 'public' | 'unlisted' | 'private';
		type: 'free' | 'premium';
		categories: string[];
		tags: string[];
		durationSec: number;
		full?: MuxPlayback;
		poster?: MovieImage;
		thumbnail?: MovieImage;
		pricing: MoviePricing;
		stats: MovieStats;
		isFeatured: boolean;
		isDeleted: boolean;
		publishedAt: string;
		createdAt: string;
		updatedAt: string;
		__v?: number;
		trendingScore?: number;
	};

	export type TrendingResponse = {
		movies: Movie[];
	};

	export type MovieListResponse = {
		movies: Movie[];
		pagination: PaginationType;
	};

	export type Category = {
		_id: string;
		name: string;
		slug: string;
		description: string;
		moviesCount: number;
		isActive: boolean;
		order: number;
	};

	export type CategoryResponse = {
		categories: Category[];
	};

	export type PlaybackInfo = {
		trailerUrl: string;
		fullUrl: string;
		isEntitled: boolean;
		entitlementType: 'free' | 'premium';
		expiresAt: string | null;
	};

	export type CreateMovieRequest = {
		title: string;
		description: string;
		visibility?: 'public' | 'unlisted' | 'private';
		type?: 'free' | 'premium';
		categories?: string[];
		tags?: string[];
		durationSec?: number;
		full?: {
			assetId?: string;
			playbackId?: string;
			uploadId?: string;
		};
		poster?: {
			publicId: string;
			url: string;
			secureUrl: string;
		};
		thumbnail?: {
			publicId: string;
			url: string;
			secureUrl: string;
		};
		pricing?: {
			currency: string;
			rentPriceCents: number;
			buyPriceCents: number;
			rentDurationHours: number;
		};
		isFeatured?: boolean;
		publishedAt?: string;
	};

	export type MuxUploadResponse = {
		uploadUrl: string;
		uploadId: string;
	};

	export type UpdateMovieRequest = {
		thumbnail?: {
			publicId: string;
			url: string;
			secureUrl: string;
		};
		categories?: string[];
		tags?: string[];
		visibility?: 'public' | 'unlisted' | 'private';
		description?: string;
		type?: 'free' | 'premium';
		pricing?: {
			currency: string;
			rentPriceCents: number;
			buyPriceCents: number;
			rentDurationHours: number;
		};
	};

	// Creator profile types
	export type CreatorProfile = {
		_id: string;
		userId: string;
		displayName: string;
		bio?: string;
		avatarUrl?: string;
		bannerUrl?: string;
		socialLinks?: {
			website?: string;
			twitter?: string;
			instagram?: string;
			youtube?: string;
		};
		stats: {
			subscribersCount: number;
			totalViews: number;
			totalEarningsCents: number;
		};
		isVerified: boolean;
		createdAt: string;
		updatedAt: string;
	};

	export type SetupCreatorProfileInput = {
		displayName: string;
		bio?: string;
		avatarUrl?: string;
		bannerUrl?: string;
		socialLinks?: {
			website?: string;
			twitter?: string;
			instagram?: string;
			youtube?: string;
		};
	};

	export type UpdateCreatorProfileInput = {
		displayName?: string;
		username?: string;
		bio?: string;
		avatarUrl?: string;
		bannerUrl?: string;
		socialLinks?: {
			website?: string;
			twitter?: string;
			instagram?: string;
			youtube?: string;
		};
	};

	export type CreatorProfileResponse = {
		creator: CreatorProfile;
	};

	export type WatchProgressResponse = {
		progressSeconds: number;
		totalDurationSeconds: number;
		completed: boolean;
		updatedAt?: string;
	};

	export type WatchHistoryItem = {
		_id: string;
		userId: string;
		movieId: {
			_id: string;
			creatorId: {
				_id: string;
				displayName: string;
				isVerified: boolean;
			};
			title: string;
			slug: string;
			durationSec: number;
			thumbnail: {
				publicId: string;
				url: string;
				secureUrl: string;
			};
			stats: {
				viewsCount: number;
			};
		};
		__v: number;
		createdAt: string;
		lastWatchedAt: string;
		progressSeconds: number;
		totalDurationSeconds: number;
		updatedAt: string;
	};

	export type WatchHistoryResponse = {
		history: WatchHistoryItem[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			pages: number;
		};
	};

	export type LikedVideo = {
		_id: string;
		movieId: {
			stats: {
				viewsCount: number;
				likesCount: number;
				commentsCount: number;
				avgRating: number;
				ratingCount: number;
			};
			_id: string;
			creatorId: {
				_id: string;
				displayName: string;
				isVerified: boolean;
			};
			title: string;
			slug: string;
			durationSec: number;
			thumbnail: {
				publicId: string;
				url: string;
				secureUrl: string;
			};
			createdAt: string;
		};
		userId: string;
		createdAt: string;
		__v: number;
	};

	export type LikedVideosResponse = {
		liked: LikedVideo[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			pages: number;
		};
	};

	export type Subscription = {
		_id: string;
		creatorId: {
			stats: {
				totalVideos: number;
				subscribersCount: number;
				totalViews: number;
				totalEarningsCents: number;
			};
			_id: string;
			displayName: string;
			bio: string;
			isVerified: boolean;
			createdAt: string;
		};
		userId: string;
		createdAt: string;
		__v: number;
	};

	export type SubscriptionsResponse = {
		subscriptions: Subscription[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			pages: number;
		};
	};

	export type CreatorVideo = {
		_id: string;
		title: string;
		slug: string;
		type: 'free' | 'premium';
		durationSec: number;
		thumbnail: {
			publicId: string;
			url: string;
			secureUrl: string;
		};
		createdAt: string;
		stats: {
			viewsCount: number;
			likesCount: number;
			commentsCount: number;
			avgRating: number;
			ratingCount: number;
		};
		pricing: {
			currency: string;
			rentPriceCents: number;
			buyPriceCents: number;
			rentDurationHours: number;
		};
	};

	export type CreatorPublicVideosResponse = {
		movies: CreatorVideo[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			pages: number;
		};
	};
}

export {};
