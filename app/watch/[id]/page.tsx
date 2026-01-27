'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VideoCard } from '@/components/video-card';
import {
	ThumbsUp,
	ThumbsDown,
	Share2,
	Download,
	Flag,
	DollarSign,
	Play,
	ChevronDown,
	ChevronUp,
	Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getMovieById, getBrowseMovies, getMoviePlayback } from '@/api/movies';
import {
	likeMovie,
	unlikeMovie,
	getLikeStatus,
	dislikeMovie,
	undislikeMovie,
	getDislikeStatus,
	getSubscriptionStatus,
	subscribeToCreator,
	unsubscribeFromCreator,
	recordView,
	getWatchProgress,
	saveWatchProgress,
} from '@/api/engagement';
import MuxPlayer from '@mux/mux-player-react';

import { mapMovieToVideoCard, formatNumber } from '@/lib/movie-utils';
import { CommentSection } from '@/components/comments/comment-section';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/use-toast';

// If you already have these globally, remove the redeclare.
// type ApiRequestResponseType<T> = any;
// type Movie = any;

export default function WatchPage() {
	const params = useParams();
	const id = params.id as string;
	const router = useRouter();

	const { isAuthenticated, user } = useAuthStore();
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const [showFullDescription, setShowFullDescription] = useState(false);
	const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
	const [hasPlaybackError, setHasPlaybackError] = useState(false);

	// MuxPlayer ref
	const playerRef = useRef<any>(null);

	// avoid rerender churn from progress updates
	const lastSavedProgressRef = useRef(0);
	const didInitialSeekRef = useRef(false);

	// Movie
	const {
		data: movieResponse,
		isLoading: isLoadingMovie,
		error: movieError,
	} = useQuery({
		queryKey: ['movie', id],
		queryFn: () => getMovieById(id),
		enabled: !!id,
	});

	const movie = movieResponse?.data?.data?.movie;
	const firstCategory = movie?.categories?.[0];

	// Related
	const { data: relatedResponse, isLoading: isLoadingRelated } = useQuery({
		queryKey: ['related-movies', firstCategory],
		queryFn: () => getBrowseMovies({ categories: firstCategory, limit: 4 }),
		enabled: !!firstCategory,
	});

	// Playback
	const { data: playbackResponse, isLoading: isLoadingPlayback } = useQuery({
		queryKey: ['playback', id],
		queryFn: () => getMoviePlayback(id),
		enabled: !!id,
	});

	const playbackInfo = playbackResponse?.data?.data?.playback;

	// Engagement Status Queries
	const { data: likeStatus } = useQuery({
		queryKey: ['likeStatus', id],
		queryFn: () => getLikeStatus(id),
		enabled: !!id && isAuthenticated,
	});

	const { data: dislikeStatus } = useQuery({
		queryKey: ['dislikeStatus', id],
		queryFn: () => getDislikeStatus(id),
		enabled: !!id && isAuthenticated,
	});

	const { data: subStatus } = useQuery({
		queryKey: ['subStatus', movie?.creatorId?._id],
		queryFn: () => getSubscriptionStatus(movie?.creatorId?._id as string),
		enabled: !!movie?.creatorId?._id && isAuthenticated,
	});

	const isLiked = likeStatus?.data?.data?.liked || false;
	const isDisliked = dislikeStatus?.data?.data?.disliked || false;
	const isSubscribed = subStatus?.data?.data?.subscribed || false;

	// Watch Progress
	const { data: watchProgress } = useQuery({
		queryKey: ['watchProgress', id],
		queryFn: () => getWatchProgress(id),
		enabled: !!id && isAuthenticated && !isPlayingTrailer,
	});

	const savedProgress = watchProgress?.data?.data?.progressSeconds || 0;
	const isCompleted = watchProgress?.data?.data?.completed || false;

	// Reset initial seek flag when switching trailer/full or when movie changes
	useEffect(() => {
		didInitialSeekRef.current = false;
		lastSavedProgressRef.current = savedProgress || 0;
	}, [id, isPlayingTrailer, savedProgress]);

	// Save progress mutation
	const { mutate: saveProgress } = useMutation({
		mutationFn: (data: { progress: number; duration: number }) =>
			saveWatchProgress(id, data.progress, data.duration),
		onError: () => {
			// silent: progress updates shouldn't annoy user
			// eslint-disable-next-line no-console
			console.error('Failed to save watch progress');
		},
	});

	const handleTimeUpdate = useCallback(
		(e: Event) => {
			if (isPlayingTrailer) return;
			if (!isAuthenticated) return;

			// MuxPlayer/HTMLVideoElement exposes currentTime on target
			const target = e.target as HTMLVideoElement;
			const progress = target.currentTime;
			const duration = target.duration || 0;

			if (!duration || duration <= 0) return;

			// Save every 5 seconds of real movement
			if (Math.abs(progress - lastSavedProgressRef.current) >= 5) {
				console.log('Saving progress:', progress, 'Duration:', duration);
				saveProgress({ progress, duration });
				lastSavedProgressRef.current = progress;
			}
		},
		[isPlayingTrailer, isAuthenticated, saveProgress],
	);

	// View Recording
	useEffect(() => {
		if (!id) return;
		recordView(id);
	}, [id]);

	// Mutations
	const { mutate: toggleLike } = useMutation({
		mutationFn: (): ApiRequestResponseType<any> =>
			isLiked ? unlikeMovie(id) : likeMovie(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['likeStatus', id] });
			queryClient.invalidateQueries({ queryKey: ['movie', id] });
			if (isDisliked) {
				queryClient.invalidateQueries({ queryKey: ['dislikeStatus', id] });
			}
		},
		onError: () => {
			toast({
				title: 'Error',
				description: 'Failed to update like',
				variant: 'destructive',
			});
		},
	});

	const { mutate: toggleDislike } = useMutation({
		mutationFn: (): ApiRequestResponseType<any> =>
			isDisliked ? undislikeMovie(id) : dislikeMovie(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dislikeStatus', id] });
			queryClient.invalidateQueries({ queryKey: ['movie', id] });
			if (isLiked)
				queryClient.invalidateQueries({ queryKey: ['likeStatus', id] });
		},
		onError: () => {
			toast({
				title: 'Error',
				description: 'Failed to update dislike',
				variant: 'destructive',
			});
		},
	});

	const { mutate: toggleSubscribe, isPending: isSubscribing } = useMutation({
		mutationFn: (): ApiRequestResponseType<any> => {
			const creatorId = movie?.creatorId?._id;
			if (!creatorId) throw new Error('No creator ID');
			return isSubscribed
				? unsubscribeFromCreator(creatorId)
				: subscribeToCreator(creatorId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['subStatus', movie?.creatorId?._id],
			});
		},
		onError: () => {
			toast({
				title: 'Error',
				description: 'Failed to update subscription',
				variant: 'destructive',
			});
		},
	});

	const handleAuthAction = useCallback(
		(action: () => void) => {
			if (!isAuthenticated) {
				toast({
					title: 'Unauthorized',
					description: 'Please sign in to perform this action',
					variant: 'destructive',
				});
				router.push('/login');
				return;
			}
			action();
		},
		[isAuthenticated, router, toast],
	);

	const relatedVideos = useMemo(() => {
		const list =
			(relatedResponse?.data?.data as unknown as Movie[])?.filter(
				(m) => m._id !== id,
			) || [];
		return list.map(mapMovieToVideoCard);
	}, [relatedResponse, id]);

	// Loading skeleton
	if (isLoadingMovie && !movie) {
		return (
			<div className="min-h-screen">
				<Header />
				<main className="container mx-auto px-4 py-6">
					<div className="grid gap-6 lg:grid-cols-[1fr_380px]">
						<div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />
						<div className="space-y-4">
							<div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
							<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
						</div>
					</div>
				</main>
			</div>
		);
	}

	// Not found
	if (movieError || !movie) {
		return (
			<div className="min-h-screen">
				<Header />
				<main className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-6 text-center">
					<h2 className="mb-2 text-2xl font-bold">Movie not found</h2>
					<p className="text-muted-foreground">
						The movie you are looking for does not exist or has been removed.
					</p>
					<Button
						className="mt-4"
						variant="outline"
						onClick={() => window.history.back()}>
						Go Back
					</Button>
				</main>
			</div>
		);
	}

	const posterFallback =
		movie.poster?.url || movie.thumbnail?.url || '/placeholder.svg';

	const isEntitled = !!playbackInfo?.isEntitled;
	const trailerUrl = playbackInfo?.trailerUrl;
	const fullUrl = playbackInfo?.fullUrl;

	// If not entitled, only allow fullUrl when trailer is playing (i.e. actually show trailer)
	const activeUrl = isPlayingTrailer
		? trailerUrl
		: isEntitled
			? fullUrl
			: trailerUrl;

	// Avoid "light mode" blocking resume/autoplay when we have saved progress
	const shouldLight =
		!isPlayingTrailer && (savedProgress <= 0 || isCompleted)
			? posterFallback
			: false;

	const shouldAutoplay = !shouldLight && !!activeUrl;

	return (
		<div className="min-h-screen">
			<Header />

			<main className="container mx-auto px-4 py-6">
				<div className="grid gap-6 lg:grid-cols-[1fr_380px]">
					{/* Main Content */}
					<div className="space-y-4">
						{/* Video Player */}
						<div className="relative aspect-video overflow-hidden rounded-lg bg-black">
							{activeUrl && !hasPlaybackError ? (
								<MuxPlayer
									ref={playerRef}
									src={activeUrl}
									style={{ height: '100%', width: '100%' }}
									autoPlay={shouldAutoplay}
									onTimeUpdate={handleTimeUpdate}
									onLoadedMetadata={() => {
										if (
											didInitialSeekRef.current ||
											isPlayingTrailer ||
											isCompleted ||
											savedProgress <= 0
										) {
											return;
										}
										didInitialSeekRef.current = true;
										if (playerRef.current) {
											playerRef.current.currentTime = savedProgress;
										}
									}}
									poster={posterFallback}
									onError={() => setHasPlaybackError(true)}
								/>
							) : playbackInfo || hasPlaybackError || isLoadingPlayback ? (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
									<Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
									<p className="text-lg font-medium">
										{hasPlaybackError ? 'Processing Media' : 'Media Processing'}
									</p>
									<p className="text-sm text-muted-foreground">
										This video is being optimized. Check back soon.
									</p>
									<Button
										variant="outline"
										className="mt-4"
										onClick={() => {
											setHasPlaybackError(false);
											queryClient.invalidateQueries({
												queryKey: ['playback', id],
											});
											toast({ description: 'Refreshing status...' });
										}}>
										Refresh Status
									</Button>
								</div>
							) : (
								<>
									<img
										src={posterFallback}
										alt={movie.title}
										className="h-full w-full object-cover"
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-black/40">
										<Button
											size="lg"
											className="h-20 w-20 rounded-full bg-primary/90 hover:bg-primary"
											onClick={() => setIsPlayingTrailer(true)}>
											<Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
										</Button>
									</div>
								</>
							)}

							{/* Premium Overlay */}
							{!isEntitled && !isPlayingTrailer && (
								<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
									<div className="text-center">
										<DollarSign className="mx-auto mb-4 h-12 w-12 text-primary" />
										<h3 className="mb-2 text-xl font-bold text-white">
											Premium Content
										</h3>
										<p className="mb-6 text-white/80">
											Rent or buy to watch this AI movie
										</p>
										<div className="flex justify-center gap-3">
											{movie.pricing?.rentPriceCents > 0 && (
												<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
													Rent $
													{(movie.pricing.rentPriceCents / 100).toFixed(2)}
												</Button>
											)}
											{movie.pricing?.buyPriceCents > 0 && (
												<Button
													variant="outline"
													className="border-white bg-transparent text-white hover:bg-white/10">
													Buy ${(movie.pricing.buyPriceCents / 100).toFixed(2)}
												</Button>
											)}
										</div>

										<Button
											variant="link"
											className="mt-4 text-white hover:text-primary"
											onClick={() => setIsPlayingTrailer(true)}>
											Watch Trailer
										</Button>
									</div>
								</div>
							)}
						</div>

						{/* Video Info */}
						<div>
							<h1 className="mb-2 text-2xl font-bold leading-tight">
								{movie.title}
							</h1>

							{/* Tags */}
							<div className="mb-4 flex flex-wrap gap-2">
								{movie.tags?.map((tag: string) => (
									<Badge
										key={tag}
										variant="secondary"
										className="text-xs">
										{tag}
									</Badge>
								))}
							</div>

							{/* Stats and Actions */}
							<div className="flex flex-wrap items-center justify-between gap-4">
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>
										{formatNumber(movie.stats?.viewsCount || 0)} views
									</span>
									<span>•</span>
									<span>
										{movie.createdAt
											? new Date(movie.createdAt).toLocaleDateString()
											: 'Unknown date'}
									</span>
								</div>

								<div className="flex flex-wrap items-center gap-2">
									<div className="flex items-center rounded-full border border-border bg-secondary">
										<Button
											variant="ghost"
											size="sm"
											className={`rounded-l-full ${isLiked ? 'text-primary' : ''}`}
											onClick={() => handleAuthAction(() => toggleLike())}>
											<ThumbsUp className="mr-2 h-4 w-4" />
											{formatNumber(movie.stats?.likesCount || 0)}
										</Button>
										<Separator
											orientation="vertical"
											className="h-6"
										/>
										<Button
											variant="ghost"
											size="sm"
											className={`rounded-r-full ${
												isDisliked ? 'text-destructive' : ''
											}`}
											onClick={() => handleAuthAction(() => toggleDislike())}>
											<ThumbsDown className="h-4 w-4" />
										</Button>
									</div>

									<Button
										variant="secondary"
										size="sm">
										<Share2 className="mr-2 h-4 w-4" />
										Share
									</Button>

									<Button
										variant="secondary"
										size="sm">
										<Download className="mr-2 h-4 w-4" />
										Download
									</Button>

									<Button
										variant="ghost"
										size="sm">
										<Flag className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>

						{/* Creator Info */}
						<div className="rounded-lg border border-border bg-card p-4">
							<div className="flex items-start justify-between">
								<div className="flex gap-3">
									<Avatar className="h-12 w-12">
										<AvatarImage
											src={movie.creatorId?.avatarUrl || '/placeholder.svg'}
											alt={movie.creatorId?.displayName}
										/>
										<AvatarFallback>
											{movie.creatorId?.displayName?.charAt(0) || 'C'}
										</AvatarFallback>
									</Avatar>

									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold">
												{movie.creatorId?.displayName}
											</h3>
											{movie.creatorId?.isVerified && (
												<Badge className="bg-primary text-xs text-primary-foreground">
													Verified
												</Badge>
											)}
										</div>
									</div>
								</div>

								{user?._id !== movie.creatorId?._id && (
									<Button
										className={
											isSubscribed
												? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
												: 'bg-primary text-primary-foreground hover:bg-primary/90'
										}
										onClick={() => handleAuthAction(() => toggleSubscribe())}
										disabled={isSubscribing}>
										{isSubscribing && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										{isSubscribed ? 'Subscribed' : 'Subscribe'}
									</Button>
								)}
							</div>

							{/* Description */}
							<div className="mt-4">
								<div
									className={`whitespace-pre-wrap text-sm leading-relaxed ${
										!showFullDescription ? 'line-clamp-3' : ''
									}`}>
									{movie.description}
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="mt-2"
									onClick={() => setShowFullDescription((v) => !v)}>
									{showFullDescription ? (
										<>
											Show less <ChevronUp className="ml-1 h-4 w-4" />
										</>
									) : (
										<>
											Show more <ChevronDown className="ml-1 h-4 w-4" />
										</>
									)}
								</Button>
							</div>
						</div>

						{/* Comments Section */}
						<CommentSection
							movieId={id}
							commentsCount={movie.stats?.commentsCount || 0}
						/>
					</div>

					{/* Sidebar */}
					<div className="space-y-4">
						<h2 className="text-lg font-bold">Related Videos</h2>
						<div className="space-y-4">
							{isLoadingRelated
								? Array.from({ length: 4 }).map((_, i) => (
										<div
											key={i}
											className="flex gap-3">
											<div className="aspect-video w-40 animate-pulse rounded-md bg-muted" />
											<div className="flex-1 space-y-2">
												<div className="h-3 w-full animate-pulse rounded bg-muted" />
												<div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
											</div>
										</div>
									))
								: relatedVideos.map((video) => (
										<VideoCard
											key={video.id}
											{...video}
										/>
									))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
