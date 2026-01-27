'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { VideoCard } from '@/components/video-card';
import { TrendingUp, Flame, Clock, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getTrendingMovies, getBrowseMovies } from '@/api/movies';
import { mapMovieToVideoCard } from '@/lib/movie-utils';
import { Header } from '@/components/header';
import { VideoCardSkeleton } from '@/components/skeletons/video-card-skeleton';

const trendingCategories = [
	{ id: 'hot', label: 'Hot Now', icon: Flame },
	{ id: 'trending', label: 'Trending', icon: TrendingUp },
	{ id: 'recent', label: 'Recent', icon: Clock },
	{ id: 'top-rated', label: 'Top Rated', icon: Star },
];

export default function TrendingPage() {
	const [activeCategory, setActiveCategory] = useState('hot');
	const observerTarget = useRef<HTMLDivElement>(null);

	const fetchMovies = async ({ pageParam }: { pageParam?: string }) => {
		if (activeCategory === 'trending') {
			const response = await getTrendingMovies({ limit: 20 });
			return {
				movies: response.data.data.movies,
				nextPage: null,
			};
		}

		let sort = 'popular';
		if (activeCategory === 'recent') sort = 'latest';
		if (activeCategory === 'top-rated') sort = 'rating';
		const params: any = { sort, limit: 20 };
		if (pageParam) {
			params.cursor = pageParam;
		}

		console.log('Fetching browsing movies with params:', params);
		const response = await getBrowseMovies(params);
		const movies = response.data.data;
		const pagination = response.data.meta?.pagination;

		return {
			movies,
			nextPage: pagination?.hasMore ? (pagination.nextCursor ?? null) : null,
		};
	};

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		error,
	} = useInfiniteQuery({
		queryKey: ['trendingMovies', activeCategory],
		queryFn: fetchMovies,
		getNextPageParam: (lastPage) => lastPage.nextPage,
		initialPageParam: undefined as string | undefined,
	});

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			// Trigger fetch earlier with rootMargin, when target is approaching viewport
			if (target.isIntersecting && hasNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage],
	);

	useEffect(() => {
		const element = observerTarget.current;
		if (!element) return;

		const observer = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: '500px', // Optimistic loading: trigger 500px before reaching the bottom
			threshold: 0,
		});

		observer.observe(element);

		return () => {
			if (element) observer.unobserve(element);
		};
	}, [handleObserver]);

	const allMovies = data?.pages.flatMap((page) => page.movies) || [];
	const activeMovies = allMovies.map(mapMovieToVideoCard);

	return (
		<div className="min-h-screen bg-background pb-12">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">
						Trending on AI Movies
					</h1>
					<p className="text-muted-foreground text-lg">
						Discover the hottest AI-generated movies right now
					</p>
				</div>

				<div className="flex flex-wrap gap-2 mb-8">
					{trendingCategories.map((category) => {
						const Icon = category.icon;
						return (
							<Button
								key={category.id}
								variant={activeCategory === category.id ? 'default' : 'outline'}
								onClick={() => setActiveCategory(category.id)}
								className="gap-2">
								<Icon className="h-4 w-4" />
								{category.label}
							</Button>
						);
					})}
				</div>

				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						{activeCategory === 'hot' && (
							<Flame className="h-6 w-6 text-primary" />
						)}
						{activeCategory === 'trending' && (
							<TrendingUp className="h-6 w-6 text-primary" />
						)}
						{activeCategory === 'recent' && (
							<Clock className="h-6 w-6 text-primary" />
						)}
						{activeCategory === 'top-rated' && (
							<Star className="h-6 w-6 text-primary" />
						)}

						<h2 className="text-2xl font-bold text-foreground">
							{trendingCategories.find((c) => c.id === activeCategory)?.label}
						</h2>
					</div>

					{status === 'pending' ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<VideoCardSkeleton key={`skeleton-${i}`} />
							))}
						</div>
					) : status === 'error' ? (
						<div className="text-center text-red-500 py-12">
							Error loading movies:{' '}
							{error instanceof Error ? error.message : 'Unknown error'}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{activeMovies.map((video, index) => (
								<div
									key={`${video.id}-${index}`}
									className="relative">
									{activeCategory === 'hot' && index < 10 && (
										<div className="absolute -left-4 top-4 z-10 pointer-events-none">
											<div className="bg-primary text-primary-foreground font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
												{index + 1}
											</div>
										</div>
									)}
									<VideoCard {...video} />
								</div>
							))}
							{isFetchingNextPage &&
								Array.from({ length: 4 }).map((_, i) => (
									<VideoCardSkeleton key={`next-skeleton-${i}`} />
								))}

							{!isFetchingNextPage && activeMovies.length === 0 && (
								<div className="col-span-full text-center text-muted-foreground py-12">
									No movies found in this category.
								</div>
							)}
						</div>
					)}

					{/* Infinite Scroll Trigger */}
					<div
						ref={observerTarget}
						className="h-10 mt-8"
					/>
				</div>
			</div>
		</div>
	);
}
