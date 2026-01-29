'use client';

import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { VideoCard } from '@/components/video-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingMovies } from '@/api/movies';
import { VideoCardSkeleton } from '@/components/skeletons/video-card-skeleton';
import { mapMovieToVideoCard } from '@/lib/movie-utils';
import Link from 'next/link';

export default function HomePage() {
	const {
		data: trendingData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['trending-movies'],
		queryFn: () => getTrendingMovies({ limit: 12 }),
	});

	const movies = trendingData?.data?.data?.movies || [];
	const trendingVideos = movies.map(mapMovieToVideoCard);
	const premiumVideos = movies
		.filter((m) => m.type === 'premium')
		.map(mapMovieToVideoCard);
	const freeVideos = movies
		.filter((m) => m.type === 'free')
		.map(mapMovieToVideoCard);

	// Loading state with Skeletons
	if (isLoading) {
		return (
			<div className="min-h-screen">
				<Header />
				<HeroSection />
				<main className="container mx-auto px-4 py-12">
					<section className="mb-16">
						<div className="mb-6 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Flame className="h-6 w-6 text-primary" />
								<h2 className="text-2xl font-bold">Trending Now</h2>
							</div>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<VideoCardSkeleton key={`home-skeleton-${i}`} />
							))}
						</div>
					</section>
				</main>
			</div>
		);
	}

	// Simple error state
	if (error) {
		console.error('Error fetching trending movies:', error);
	}

	return (
		<div className="min-h-screen">
			<Header />
			<HeroSection />

			{/* Main Content */}
			<main className="container mx-auto px-4 py-12">
				{/* Trending Section */}
				<section className="mb-16">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Flame className="h-6 w-6 text-primary" />
							<h2 className="text-2xl font-bold">Trending Now</h2>
						</div>
						<Button
							variant="ghost"
							className="text-primary hover:text-primary hover:bg-primary/10"
							asChild>
							<Link href="/trending">View All</Link>
						</Button>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{trendingVideos.slice(0, 8).map((video) => (
							<VideoCard
								key={video.id}
								{...video}
							/>
						))}
						{trendingVideos.length === 0 && !isLoading && (
							<div className="col-span-full text-center text-muted-foreground">
								No trending videos found.
							</div>
						)}
					</div>
				</section>

				{/* Categories */}
				<section className="mb-16">
					<Tabs
						defaultValue="all"
						className="w-full">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-2xl font-bold">Explore Categories</h2>
						</div>

						<TabsList className="mb-6 w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0">
							<TabsTrigger
								value="all"
								className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
								<Sparkles className="h-4 w-4" />
								All
							</TabsTrigger>
							<TabsTrigger
								value="premium"
								className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
								<TrendingUp className="h-4 w-4" />
								Premium
							</TabsTrigger>
							<TabsTrigger
								value="free"
								className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">
								<Clock className="h-4 w-4" />
								Free
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="all"
							className="mt-0">
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{trendingVideos.map((video) => (
									<VideoCard
										key={video.id}
										{...video}
									/>
								))}
							</div>
						</TabsContent>

						<TabsContent
							value="premium"
							className="mt-0">
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{premiumVideos.map((video) => (
									<VideoCard
										key={video.id}
										{...video}
									/>
								))}
							</div>
						</TabsContent>

						<TabsContent
							value="free"
							className="mt-0">
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{freeVideos.map((video) => (
									<VideoCard
										key={video.id}
										{...video}
									/>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</section>

				{/* CTA Section */}
				<section className="rounded-lg border border-primary/40 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 p-12 text-center">
					<h2 className="mb-4 text-3xl font-bold">
						Ready to Share Your AI Creation?
					</h2>
					<p className="mb-8 text-lg text-foreground/80">
						Join thousands of creators earning from their AI movies. Free to
						upload, you only pay when you profit.
					</p>
					<Link
						href="/upload"
						className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
						Start Creating Today
					</Link>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-border bg-card py-12 mt-16">
				<div className="container mx-auto px-4">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4">
								<img
									src="/logo.png"
									alt="AI MOVIES"
									className="h-10 w-auto object-contain"
								/>
							</div>
							<p className="text-sm text-muted-foreground">
								The premier platform for AI-generated cinema. Create, share, and
								earn.
							</p>
						</div>

						<div>
							<h3 className="mb-4 font-semibold">Platform</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a
										href="/browse"
										className="hover:text-primary transition-colors">
										Browse
									</a>
								</li>
								<li>
									<a
										href="/trending"
										className="hover:text-primary transition-colors">
										Trending
									</a>
								</li>
								<li>
									<a
										href="/marketplace"
										className="hover:text-primary transition-colors">
										Marketplace
									</a>
								</li>
								<li>
									<a
										href="/pricing"
										className="hover:text-primary transition-colors">
										Pricing
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 font-semibold">Creators</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a
										href="/upload"
										className="hover:text-primary transition-colors">
										Upload
									</a>
								</li>
								<li>
									<a
										href="/dashboard"
										className="hover:text-primary transition-colors">
										Dashboard
									</a>
								</li>
								<li>
									<a
										href="/analytics"
										className="hover:text-primary transition-colors">
										Analytics
									</a>
								</li>
								<li>
									<a
										href="/resources"
										className="hover:text-primary transition-colors">
										Resources
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 font-semibold">Company</h3>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>
									<a
										href="/about"
										className="hover:text-primary transition-colors">
										About
									</a>
								</li>
								<li>
									<a
										href="/blog"
										className="hover:text-primary transition-colors">
										Blog
									</a>
								</li>
								<li>
									<a
										href="/careers"
										className="hover:text-primary transition-colors">
										Careers
									</a>
								</li>
								<li>
									<a
										href="/contact"
										className="hover:text-primary transition-colors">
										Contact
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
						<p>
							&copy; 2026 AIMovies.ai. All rights reserved. Empowering AI
							creators worldwide.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
