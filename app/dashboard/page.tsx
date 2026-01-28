'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/header';
import { AccessDenied } from '@/components/access-denied';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	DashboardHeader,
	StatsCardGrid,
	VideoPerformanceCard,
	TransactionsTable,
	VideoListCard,
	EarningsCardGrid,
	EarningsBreakdownCard,
	DemographicsCard,
	WatchTimeCard,
	TopVideosCard,
	type DashboardStats,
	type VideoData,
	type Transaction,
} from '@/components/dashboard';
import { useQuery } from '@tanstack/react-query';
import { getCreatorMovies } from '@/api/movies';
import { useRouter } from 'next/navigation';
import {
	useUser,
	useIsAuthenticated,
	useIsRefreshing,
} from '@/store/useAuthStore';

// Dummy stats - will be replaced with real data from API in the future
const stats: DashboardStats = {
	totalEarnings: 0,
	monthlyEarnings: 0,
	totalViews: 0,
	subscribers: 0,
	totalVideos: 0,
	avgViewDuration: '0:00',
};

const transactions: Transaction[] = [];

export default function DashboardPage() {
	const user = useUser();
	const isAuthenticated = useIsAuthenticated();
	const isRefreshing = useIsRefreshing();
	const [showAccessDenied, setShowAccessDenied] = useState(false);

	const handleWithdraw = () => {
		// TODO: Implement withdrawal
		console.log('Withdraw clicked');
	};

	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated && !isRefreshing) {
			router.push('/login');
			return;
		}
		if (user && user.role !== 'admin' && user.role !== 'creator') {
			setShowAccessDenied(true);
		}
	}, [isAuthenticated, isRefreshing, user, router]);

	const handleWatch = (movie: Movie) => {
		router.push(`/watch/${movie._id}`);
	};

	const handleEdit = (movie: Movie) => {
		router.push(`/dashboard/edit/${movie._id}`);
	};

	const handleDownload = (movie: Movie) => {
		console.log('Download video:', movie._id);
	};

	const handleDelete = (movie: Movie) => {
		console.log('Delete video:', movie._id);
	};

	const { data: creatorMoviesData } = useQuery({
		queryKey: ['creatorMovies'],
		queryFn: () => getCreatorMovies({ limit: 20 }),
	});

	const creatorMovies = creatorMoviesData?.data?.data?.movies;

	// Transform creator movies to VideoData format for display
	const recentPerformanceVideos = useMemo(() => {
		if (!creatorMovies || creatorMovies.length === 0) return [];
		return creatorMovies.slice(0, 3).map((movie: any) => ({
			id: movie._id,
			title: movie.title,
			thumbnail:
				movie.thumbnail?.secureUrl ||
				movie.thumbnail?.url ||
				'/placeholder.svg',
			views: movie.stats?.viewsCount || 0,
			earnings: (movie.stats?.totalEarningsCents || 0) / 100,
			uploadDate: movie.createdAt
				? new Date(movie.createdAt).toLocaleDateString()
				: 'Unknown',
			status:
				movie.visibility === 'public'
					? 'Published'
					: movie.visibility.charAt(0).toUpperCase() +
						movie.visibility.slice(1),
			duration: movie.full?.duration
				? `${Math.floor(movie.full.duration / 60)}:${String(movie.full.duration % 60).padStart(2, '0')}`
				: '0:00',
		}));
	}, [creatorMovies]);

	if (showAccessDenied) {
		return (
			<div className="min-h-screen">
				<Header />
				<AccessDenied
					title="Creator Access Required"
					description="You need to be a creator to access the dashboard and track your earnings. Set up your creator profile to get started."
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<Header />

			<main className="container mx-auto px-4 py-8">
				{/* Page Header */}
				<DashboardHeader
					title="Creator Dashboard"
					subtitle="Track your performance and manage your content"
				/>

				{/* Stats Cards */}
				<StatsCardGrid stats={stats} />

				{/* Main Content Tabs */}
				<Tabs
					defaultValue="overview"
					className="space-y-6">
					<div className="relative">
						<TabsList className="w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0">
							<TabsTrigger
								value="overview"
								className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
								Overview
							</TabsTrigger>
							<TabsTrigger
								value="videos"
								className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
								Your Videos
							</TabsTrigger>
							<TabsTrigger
								value="earnings"
								className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
								Earnings
							</TabsTrigger>
							<TabsTrigger
								value="analytics"
								className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
								Analytics
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Overview Tab */}
					<TabsContent
						value="overview"
						className="space-y-6">
						<VideoPerformanceCard
							videos={recentPerformanceVideos}
							title="Recent Performance"
							description="Your top performing videos"
						/>
						<TransactionsTable transactions={transactions} />
					</TabsContent>

					{/* Videos Tab */}
					<TabsContent
						value="videos"
						className="space-y-6">
						<VideoListCard
							videos={creatorMovies}
							onWatch={handleWatch}
							onEdit={handleEdit}
							onDownload={handleDownload}
							onDelete={handleDelete}
						/>
					</TabsContent>

					{/* Earnings Tab */}
					<TabsContent
						value="earnings"
						className="space-y-6">
						<EarningsCardGrid
							stats={stats}
							onWithdraw={handleWithdraw}
						/>
						<EarningsBreakdownCard />
					</TabsContent>

					{/* Analytics Tab */}
					<TabsContent
						value="analytics"
						className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<DemographicsCard />
							<WatchTimeCard />
						</div>
						<TopVideosCard videos={recentPerformanceVideos} />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
