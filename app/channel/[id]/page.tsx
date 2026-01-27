'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { VideoCard } from '@/components/video-card';
import {
	Bell,
	Share2,
	MoreVertical,
	Play,
	Film,
	DollarSign,
	Users,
} from 'lucide-react';
import { getCreatorById, getCreatorVideos } from '@/api/creator';
import {
	subscribeToCreator,
	unsubscribeFromCreator,
	getSubscriptionStatus,
} from '@/api/engagement';

// Helper to format duration
const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function ChannelPage() {
	const params = useParams();
	const id = params?.id as string;

	const [creator, setCreator] = useState<CreatorProfile | null>(null);
	const [videos, setVideos] = useState<CreatorVideo[]>([]);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			fetchData();
		}
	}, [id]);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Parallel fetch for creator details and subscription status
			const [creatorRes, statusRes, videosRes] = await Promise.all([
				getCreatorById(id),
				getSubscriptionStatus(id),
				getCreatorVideos(id),
			]);

			if (creatorRes.data.success) {
				setCreator(creatorRes.data.data.creator);
			}
			if (statusRes.data.success) {
				setIsSubscribed(statusRes.data.data.subscribed);
			}
			if (videosRes.data.success) {
				setVideos(videosRes.data.data.movies);
			}
		} catch (error) {
			console.error('Failed to fetch channel data', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubscribe = async () => {
		try {
			if (isSubscribed) {
				await unsubscribeFromCreator(id);
				setIsSubscribed(false);
				// Update local stat if possible, though backend source of truth might be better
				if (creator) {
					setCreator({
						...creator,
						stats: {
							...creator.stats,
							subscribersCount: Math.max(0, creator.stats.subscribersCount - 1),
						},
					});
				}
			} else {
				await subscribeToCreator(id);
				setIsSubscribed(true);
				if (creator) {
					setCreator({
						...creator,
						stats: {
							...creator.stats,
							subscribersCount: creator.stats.subscribersCount + 1,
						},
					});
				}
			}
		} catch (error) {
			console.error('Failed to toggle subscription', error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	if (!creator) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Channel not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<Header />

			{/* Channel Banner */}
			<div className="relative h-48 w-full overflow-hidden bg-linear-to-r from-primary/20 via-secondary to-primary/20 md:h-64">
				<img
					src={creator.bannerUrl || '/channel-banner.jpg'} // Use default if no banner
					alt="Channel banner"
					className="h-full w-full object-cover"
				/>
			</div>

			{/* Channel Info */}
			<div className="border-b border-border bg-card">
				<div className="container mx-auto px-4">
					<div className="flex flex-col gap-4 py-6 md:flex-row md:items-end">
						{/* Avatar */}
						<Avatar className="h-32 w-32 border-4 border-background">
							<AvatarImage
								src={creator.avatarUrl || '/diverse-avatars.png'}
								alt={creator.displayName}
							/>
							<AvatarFallback className="text-2xl">
								{creator.displayName.charAt(0)}
							</AvatarFallback>
						</Avatar>

						{/* Info */}
						<div className="flex-1">
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2">
										<h1 className="text-2xl font-bold md:text-3xl">
											{creator.displayName}
										</h1>
										{creator.isVerified && (
											<Badge className="bg-primary text-primary-foreground">
												Verified
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground">
										@{creator.displayName.toLowerCase().replace(/\s+/g, '')}
									</p>
									<div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
										<span>{creator.stats.subscribersCount} subscribers</span>
										<span>•</span>
										<span>{creator.stats.totalVideos} videos</span>
										<span>•</span>
										<span>{creator.stats.totalViews} views</span>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="hidden gap-2 md:flex">
									<Button
										variant="ghost"
										size="icon">
										<Share2 className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Subscribe Button */}
					<div className="flex gap-3 pb-6">
						<Button
							className={
								isSubscribed
									? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									: 'bg-primary text-primary-foreground hover:bg-primary/90'
							}
							onClick={handleSubscribe}>
							<Bell className="mr-2 h-4 w-4" />
							{isSubscribed ? 'Subscribed' : 'Subscribe'}
						</Button>
						<Button
							variant="outline"
							className="bg-transparent">
							<Share2 className="mr-2 h-4 w-4" />
							Share
						</Button>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="container mx-auto px-4 py-8">
				<Tabs
					defaultValue="videos"
					className="w-full">
					<TabsList className="mb-6 w-full justify-start overflow-x-auto border-b border-border bg-transparent p-0">
						<TabsTrigger
							value="videos"
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none">
							<Play className="h-4 w-4" />
							Videos
						</TabsTrigger>
						<TabsTrigger
							value="about"
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none">
							<Film className="h-4 w-4" />
							About
						</TabsTrigger>
						<TabsTrigger
							value="store"
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none">
							<DollarSign className="h-4 w-4" />
							Store
						</TabsTrigger>
						<TabsTrigger
							value="community"
							className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-4 py-2 text-muted-foreground transition-none">
							<Users className="h-4 w-4" />
							Community
						</TabsTrigger>
					</TabsList>

					{/* Videos Tab */}
					<TabsContent
						value="videos"
						className="mt-0">
						<div className="mb-6">
							<h2 className="mb-4 text-xl font-bold">Latest Uploads</h2>
							{videos.length === 0 ? (
								<p className="text-muted-foreground">No videos available.</p>
							) : (
								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{videos.map((video) => (
										<VideoCard
											key={video._id}
											id={video._id}
											title={video.title}
											thumbnail={video.thumbnail.url}
											creator={{
												name: creator.displayName,
												avatar: creator.avatarUrl || '/diverse-avatars.png',
											}}
											views={`${video.stats.viewsCount} views`}
											uploadDate={new Date(
												video.createdAt,
											).toLocaleDateString()}
											duration={formatDuration(video.durationSec)}
										/>
									))}
								</div>
							)}
						</div>
					</TabsContent>

					{/* About Tab */}
					<TabsContent
						value="about"
						className="mt-0">
						<div className="max-w-3xl space-y-6">
							<div>
								<h2 className="mb-3 text-xl font-bold">Description</h2>
								<p className="leading-relaxed text-muted-foreground">
									{creator.bio || 'No description available.'}
								</p>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<h3 className="mb-3 font-semibold">Channel Stats</h3>
									<div className="space-y-2 rounded-lg border border-border bg-secondary/50 p-4">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Joined</span>
											<span className="font-medium">
												{new Date(creator.createdAt).toLocaleDateString()}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Total Views</span>
											<span className="font-medium">
												{creator.stats.totalViews}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Subscribers</span>
											<span className="font-medium">
												{creator.stats.subscribersCount}
											</span>
										</div>
									</div>
								</div>

								<div>
									<h3 className="mb-3 font-semibold">Links</h3>
									<div className="space-y-2">
										{/* Placeholder links as socialLinks object structure wasn't fully defined in response example but is in type */}
										{creator.socialLinks?.website && (
											<a
												href={creator.socialLinks.website}
												className="flex items-center gap-2 text-primary hover:underline">
												Website
											</a>
										)}
										{creator.socialLinks?.twitter && (
											<a
												href={creator.socialLinks.twitter}
												className="flex items-center gap-2 text-primary hover:underline">
												Twitter
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					{/* Store Tab */}
					<TabsContent
						value="store"
						className="mt-0">
						<div className="rounded-lg border border-primary/30 bg-primary/5 p-12 text-center">
							<DollarSign className="mx-auto mb-4 h-12 w-12 text-primary" />
							<h3 className="mb-2 text-xl font-bold">
								Channel Merchandise Store
							</h3>
							<p className="mb-6 text-muted-foreground">
								Browse exclusive merchandise from this creator. Coming soon!
							</p>
							<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
								Explore Store
							</Button>
						</div>
					</TabsContent>

					{/* Community Tab */}
					<TabsContent
						value="community"
						className="mt-0">
						<div className="rounded-lg border border-border bg-card p-12 text-center">
							<Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 text-xl font-bold">Community Posts</h3>
							<p className="text-muted-foreground">
								No community posts yet. Check back later for updates from this
								creator!
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
