'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { VideoCard } from '@/components/video-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBrowseMovies, getCategories, searchMovies } from '@/api/movies';
import { mapMovieToVideoCard } from '@/lib/movie-utils';
import { VideoCardSkeleton } from '@/components/skeletons/video-card-skeleton';

export default function BrowsePage() {
	return (
		<Suspense fallback={<BrowsePageSkeleton />}>
			<BrowsePageContent />
		</Suspense>
	);
}

function BrowsePageSkeleton() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="container mx-auto px-4 py-8">
				<div className="mb-8 h-10 w-64 animate-pulse rounded bg-muted" />
				<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<VideoCardSkeleton key={i} />
					))}
				</div>
			</main>
		</div>
	);
}

function BrowsePageContent() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('q') || '';

	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [showFilters, setShowFilters] = useState(false);
	const [sort, setSort] = useState('popular');
	const [onlyFree, setOnlyFree] = useState(false);
	const [onlyPremium, setOnlyPremium] = useState(false);

	// Fetch Categories
	const { data: categoriesData } = useQuery({
		queryKey: ['categories'],
		queryFn: getCategories,
	});

	const categories = categoriesData?.data?.data?.categories || [];

	// Derived query params
	const typeFilter =
		onlyFree && !onlyPremium
			? 'free'
			: onlyPremium && !onlyFree
				? 'premium'
				: undefined;

	// Fetch Movies - Search or Browse
	const { data: moviesResponse, isLoading } = useQuery<any>({
		queryKey: [
			'browse-movies',
			selectedCategory,
			sort,
			typeFilter,
			searchQuery,
		],
		queryFn: async () => {
			if (searchQuery) {
				// If searching, we skip category/sort filters for now as per simple search implementation
				// or we can pass them if API supports it.
				// Assuming search endpoint currently just takes 'q'.
				return searchMovies({ q: searchQuery, limit: 20 }) as Promise<any>;
			}
			return getBrowseMovies({
				categories: selectedCategory !== 'All' ? selectedCategory : undefined,
				sort: sort === 'popular' ? undefined : sort,
				type: typeFilter,
				limit: 20,
			}) as Promise<any>;
		},
	});

	// The API returns Movie[] directly for browse, but MovieListResponse for search (based on my update to api/movies.ts)
	// Wait, I updated searchMovies to return MovieListResponse, but getBrowseMovies returns Movie[].
	// I need to handle this discrepancy.

	// Let's standardise or check response structure.
	// getBrowseMovies returns ApiRequestResponseType<Movie[]>.
	// searchMovies returns ApiRequestResponseType<MovieListResponse> which has { movies: Movie[], pagination: ... }

	const moviesData = moviesResponse?.data?.data;
	let movies: Movie[] = [];

	if (Array.isArray(moviesData)) {
		movies = moviesData;
	} else if (moviesData && 'movies' in (moviesData as any)) {
		movies = (moviesData as any).movies;
	}

	const filteredVideos = movies.map(mapMovieToVideoCard);

	const clearFilters = () => {
		setSelectedCategory('All');
		setSort('popular');
		setOnlyFree(false);
		setOnlyPremium(false);
	};

	const getCategoryName = (name: string) => {
		return name;
	};

	return (
		<div className="min-h-screen">
			<Header />

			<main className="container mx-auto px-4 py-8">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold">
						{searchQuery
							? `Search Results for "${searchQuery}"`
							: 'Browse AI Movies'}
					</h1>
					<p className="text-muted-foreground">
						{searchQuery
							? `Found ${filteredVideos.length} matches`
							: 'Discover thousands of AI-generated movies from creators worldwide'}
					</p>
				</div>

				{/* Category Pills */}
				<div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
					<Button
						variant={selectedCategory === 'All' ? 'default' : 'outline'}
						size="sm"
						onClick={() => setSelectedCategory('All')}
						className={
							selectedCategory === 'All'
								? 'bg-primary text-primary-foreground hover:bg-primary/90'
								: 'bg-transparent'
						}>
						All
					</Button>
					{categories.map((category) => (
						<Button
							key={category._id}
							variant={
								selectedCategory === category.name ? 'default' : 'outline'
							}
							size="sm"
							onClick={() => setSelectedCategory(category.name)}
							className={
								selectedCategory === category.name
									? 'bg-primary text-primary-foreground hover:bg-primary/90'
									: 'bg-transparent'
							}>
							{category.name}
						</Button>
					))}
				</div>

				<div className="flex gap-6">
					{/* Sidebar Filters */}
					<aside
						className={`${
							showFilters ? 'block' : 'hidden'
						} w-64 shrink-0 space-y-6 rounded-lg border border-border bg-card p-6 lg:block`}>
						<div className="flex items-center justify-between">
							<h2 className="font-bold">Filters</h2>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowFilters(false)}
								className="lg:hidden">
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* Sort By */}
						<div className="space-y-2">
							<Label>Sort By</Label>
							<Select
								value={sort}
								onValueChange={setSort}>
								<SelectTrigger className="border-border bg-secondary">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="popular">Most Popular</SelectItem>
									<SelectItem value="latest">Most Recent</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
									<SelectItem value="price_low">Price: Low to High</SelectItem>
									<SelectItem value="price_high">Price: High to Low</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Content Type */}
						<div className="space-y-3">
							<Label>Content Type</Label>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Checkbox
										id="free"
										checked={onlyFree}
										onCheckedChange={(checked) => {
											setOnlyFree(!!checked);
											if (checked) setOnlyPremium(false); // Mutually exclusive usually simpler for single select logic or additive? Assuming additive but API takes single 'type' param in plan. Implementing mutual exclusion for simplicity with single type param.
										}}
									/>
									<label
										htmlFor="free"
										className="cursor-pointer text-sm">
										Free Only
									</label>
								</div>
								<div className="flex items-center gap-2">
									<Checkbox
										id="premium"
										checked={onlyPremium}
										onCheckedChange={(checked) => {
											setOnlyPremium(!!checked);
											if (checked) setOnlyFree(false);
										}}
									/>
									<label
										htmlFor="premium"
										className="cursor-pointer text-sm">
										Premium Only
									</label>
								</div>
							</div>
						</div>

						{/* Clear Filters */}
						<Button
							variant="outline"
							className="w-full bg-transparent"
							onClick={clearFilters}>
							Clear All Filters
						</Button>
					</aside>

					{/* Main Content */}
					<div className="flex-1">
						{/* Mobile Filter Button */}
						<div className="mb-4 flex items-center justify-between lg:hidden">
							<p className="text-sm text-muted-foreground">
								{filteredVideos.length} videos found
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowFilters(true)}
								className="bg-transparent">
								<Filter className="mr-2 h-4 w-4" />
								Filters
							</Button>
						</div>

						{/* Results Count */}
						<div className="mb-6 hidden items-center justify-between lg:flex">
							<p className="text-sm text-muted-foreground">
								{filteredVideos.length} videos found
							</p>
							{(selectedCategory !== 'All' || onlyFree || onlyPremium) && (
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground">
										Active filters:
									</span>
									{selectedCategory !== 'All' && (
										<Badge
											variant="secondary"
											className="gap-1">
											{getCategoryName(selectedCategory)}
											<button
												onClick={() => setSelectedCategory('All')}
												className="hover:text-destructive">
												<X className="h-3 w-3" />
											</button>
										</Badge>
									)}
									{onlyFree && (
										<Badge
											variant="secondary"
											className="gap-1">
											Free Only
											<button
												onClick={() => setOnlyFree(false)}
												className="hover:text-destructive">
												<X className="h-3 w-3" />
											</button>
										</Badge>
									)}
									{onlyPremium && (
										<Badge
											variant="secondary"
											className="gap-1">
											Premium Only
											<button
												onClick={() => setOnlyPremium(false)}
												className="hover:text-destructive">
												<X className="h-3 w-3" />
											</button>
										</Badge>
									)}
								</div>
							)}
						</div>

						{/* Video Grid */}
						{isLoading ? (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{Array.from({ length: 6 }).map((_, i) => (
									<VideoCardSkeleton key={i} />
								))}
							</div>
						) : filteredVideos.length > 0 ? (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{filteredVideos.map((video) => (
									<VideoCard
										key={video.id}
										{...video}
									/>
								))}
							</div>
						) : (
							<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
								<p className="mb-2 text-lg font-semibold">No videos found</p>
								<p className="mb-6 text-sm text-muted-foreground">
									Try adjusting your filters or search criteria
								</p>
								<Button
									variant="outline"
									onClick={clearFilters}
									className="bg-transparent">
									Clear All Filters
								</Button>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
