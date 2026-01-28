'use client';

import { Header } from '@/components/header';
import { VideoCard } from '@/components/video-card';
import { VideoCardSkeleton } from '@/components/skeletons/video-card-skeleton';
import { useQuery } from '@tanstack/react-query';
import { getBrowseMovies } from '@/api/movies';
import { mapMovieToVideoCard } from '@/lib/movie-utils';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarketplacePage() {
	const {
		data: premiumMoviesResponse,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['marketplace-premium'],
		queryFn: () => getBrowseMovies({ type: 'premium' }),
	});

	const movies = premiumMoviesResponse?.data?.data || [];
	const premiumVideos = movies.map(mapMovieToVideoCard);

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			<Header />

			<main className="flex-1 container mx-auto px-4 py-8">
				{/* Header Section */}
				<div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-2">
							<ShoppingBag className="h-8 w-8 text-primary" />
							Marketplace
						</h1>
						<p className="text-muted-foreground mt-2">
							Discover and own exclusive premium AI-generated movies. Support
							creators directly.
						</p>
					</div>
				</div>

				{/* Content Section */}
				{isLoading ? (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<VideoCardSkeleton key={`skeleton-${i}`} />
						))}
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<AlertCircle className="h-12 w-12 text-destructive mb-4" />
						<h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
						<p className="text-muted-foreground mb-4">
							Failed to load the marketplace. Please try again later.
						</p>
						<Button onClick={() => window.location.reload()}>Try Again</Button>
					</div>
				) : premiumVideos.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-card/50">
						<ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
						<h3 className="text-xl font-semibold mb-2">
							No Premium Movies Yet
						</h3>
						<p className="text-muted-foreground max-w-md mx-auto">
							Check back soon for exclusive premium content appearing in the
							marketplace.
						</p>
					</div>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{premiumVideos.map((video) => (
							<VideoCard
								key={video.id}
								{...video}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
