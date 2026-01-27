'use client';

import { useState, useEffect } from 'react';
import {
	getWatchHistory,
	getLikedVideos,
	getSubscriptions,
} from '@/api/engagement';
// Types are global
import { Header } from '@/components/header';
import { VideoCard } from '@/components/video-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	Clock,
	Heart,
	ListPlus,
	Users,
	Trash2,
	Play,
	Plus,
	MoreVertical,
	Grid,
	List,
} from 'lucide-react';

// Mock library data
// Helper to format duration
const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function LibraryPage() {
	const [viewMode, setViewMode] = useState('grid');
	const [activeTab, setActiveTab] = useState('history');
	const [history, setHistory] = useState<WatchHistoryItem[]>([]);
	const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				if (activeTab === 'history') {
					const response = await getWatchHistory();
					if (response.data.success) {
						setHistory(response.data.data.history);
					}
				} else if (activeTab === 'favorites') {
					const response = await getLikedVideos();
					if (response.data.success) {
						setLikedVideos(response.data.data.liked);
					}
				} else if (activeTab === 'subscriptions') {
					const response = await getSubscriptions();
					if (response.data.success) {
						setSubscriptions(response.data.data.subscriptions);
					}
				}
			} catch (error) {
				console.error(`Failed to fetch ${activeTab} data`, error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [activeTab]);

	return (
		<div className="min-h-screen">
			<Header />

			<main className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold">Your Library</h1>
					<p className="text-muted-foreground">
						Your personalized collection of videos, playlists, and channels
					</p>
				</div>

				<Tabs
					defaultValue="history"
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full">
					<TabsList className="mb-8 w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0">
						<TabsTrigger
							value="history"
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none">
							<Clock className="h-4 w-4" />
							Watch History
						</TabsTrigger>
						<TabsTrigger
							value="favorites"
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none">
							<Heart className="h-4 w-4" />
							Favorites
						</TabsTrigger>
						<TabsTrigger
							value="playlists"
							disabled
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none opacity-50 cursor-not-allowed">
							<ListPlus className="h-4 w-4" />
							Playlists
						</TabsTrigger>
						<TabsTrigger
							value="subscriptions"
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none">
							<Users className="h-4 w-4" />
							Subscriptions
						</TabsTrigger>
					</TabsList>

					{/* Watch History Tab */}
					<TabsContent
						value="history"
						className="mt-0">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-xl font-bold">Continue Watching</h2>
							<div className="flex gap-2">
								<Button
									variant={viewMode === 'grid' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setViewMode('grid')}>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === 'list' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setViewMode('list')}>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
							</div>
						) : history.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
								<h3 className="text-lg font-semibold">No watch history yet</h3>
								<p className="text-muted-foreground">
									Videos you watch will appear here
								</p>
							</div>
						) : viewMode === 'grid' ? (
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{history.map((item) => (
									<div
										key={item._id}
										className="group relative">
										<VideoCard
											id={item.movieId._id}
											title={item.movieId.title}
											thumbnail={item.movieId.thumbnail.url}
											creator={{
												name: item.movieId.creatorId.displayName,
												avatar: '/diverse-avatars.png', // Fallback as avatar is not in response
											}}
											views={`${item.movieId.stats.viewsCount} views`}
											uploadDate={new Date(item.createdAt).toLocaleDateString()}
											duration={formatDuration(item.movieId.durationSec)}
										/>
										{item.progressSeconds > 0 && (
											<div className="absolute bottom-0 left-0 right-0 h-1 bg-background">
												<div
													className="h-full bg-primary transition-all"
													style={{
														width: `${(item.progressSeconds / item.totalDurationSeconds) * 100}%`,
													}}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="space-y-3">
								{history.map((item) => (
									<div
										key={item._id}
										className="flex gap-4 rounded-lg border border-border bg-card p-4 hover:bg-card/80">
										<div className="relative h-24 w-32 shrink-0 overflow-hidden rounded">
											<img
												src={item.movieId.thumbnail.url || '/placeholder.svg'}
												alt={item.movieId.title}
												className="h-full w-full object-cover"
											/>
											{item.progressSeconds > 0 && (
												<div className="absolute bottom-0 left-0 right-0 h-1 bg-background">
													<div
														className="h-full bg-primary"
														style={{
															width: `${(item.progressSeconds / item.totalDurationSeconds) * 100}%`,
														}}
													/>
												</div>
											)}
										</div>
										<div className="flex-1 py-1">
											<h3 className="font-semibold line-clamp-2">
												{item.movieId.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{item.movieId.creatorId.displayName}
											</p>
											<p className="mt-1 text-xs text-muted-foreground">
												Watched{' '}
												{new Date(item.lastWatchedAt).toLocaleDateString()} •{' '}
												{item.movieId.stats.viewsCount} views
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="sm">
												<Play className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</TabsContent>

					{/* Favorites Tab */}
					<TabsContent
						value="favorites"
						className="mt-0">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-xl font-bold">Your Favorite Videos</h2>
							<Button
								variant="outline"
								size="sm">
								<Trash2 className="mr-2 h-4 w-4" />
								Clear All
							</Button>
						</div>
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
							</div>
						) : likedVideos.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Heart className="mb-4 h-12 w-12 text-muted-foreground/50" />
								<h3 className="text-lg font-semibold">
									No favorite videos yet
								</h3>
								<p className="text-muted-foreground">
									Videos you like will appear here
								</p>
							</div>
						) : (
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{likedVideos
									.filter((video) => video.movieId)
									.map((video) => (
										<VideoCard
											key={video._id}
											id={video.movieId._id}
											title={video.movieId.title}
											thumbnail={video.movieId.thumbnail.url}
											creator={{
												name: video.movieId.creatorId.displayName,
												avatar: '/diverse-avatars.png',
											}}
											views={video.movieId.stats.viewsCount.toString()}
											uploadDate={new Date(
												video.movieId.createdAt,
											).toLocaleDateString()}
											duration={formatDuration(video.movieId.durationSec)}
										/>
									))}
							</div>
						)}
					</TabsContent>

					{/* Playlists Tab */}
					<TabsContent
						value="playlists"
						className="mt-0">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-xl font-bold">Your Playlists</h2>
							<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
								<Plus className="mr-2 h-4 w-4" />
								Create Playlist
							</Button>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<ListPlus className="mb-4 h-12 w-12 text-muted-foreground/50" />
								<h3 className="text-lg font-semibold">Playlists coming soon</h3>
								<p className="text-muted-foreground">
									Create and manage your playlists here
								</p>
							</div>
						</div>
					</TabsContent>

					{/* Subscriptions Tab */}
					<TabsContent
						value="subscriptions"
						className="mt-0">
						<div>
							<h2 className="mb-6 text-xl font-bold">
								Your Subscriptions ({subscriptions.length})
							</h2>
							{loading ? (
								<div className="flex items-center justify-center py-12">
									<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
								</div>
							) : subscriptions.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
									<h3 className="text-lg font-semibold">
										No subscriptions yet
									</h3>
									<p className="text-muted-foreground">
										Channels you subscribe to will appear here
									</p>
								</div>
							) : (
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{subscriptions.map((sub) => (
										<div
											key={sub._id}
											className="rounded-lg border border-border bg-card p-4 flex items-center justify-between hover:bg-card/80 transition-colors">
											<div className="flex items-center gap-4">
												<img
													src={'/diverse-avatars.png'} // Fallback
													alt={sub.creatorId.displayName}
													className="h-12 w-12 rounded-full object-cover"
												/>
												<div>
													<div className="flex items-center gap-2">
														<h3 className="font-semibold">
															{sub.creatorId.displayName}
														</h3>
														{sub.creatorId.isVerified && (
															<Badge className="bg-primary text-primary-foreground text-xs">
																Verified
															</Badge>
														)}
													</div>
													<p className="text-xs text-muted-foreground">
														{sub.creatorId.stats.subscribersCount} subscribers
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="sm">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
