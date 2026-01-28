'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Play, BellOff } from 'lucide-react';
import Link from 'next/link';
import { getSubscriptions, unsubscribeFromCreator } from '@/api/engagement';
export default function ChannelListPage() {
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSubscriptions();
	}, []);

	const fetchSubscriptions = async () => {
		try {
			const response = await getSubscriptions();
			if (response.data.success) {
				setSubscriptions(response.data.data.subscriptions);
			}
		} catch (error) {
			console.error('Failed to fetch subscriptions', error);
		} finally {
			setLoading(false);
		}
	};

	const handleUnsubscribe = async (e: React.MouseEvent, creatorId: string) => {
		e.preventDefault(); // Prevent navigation if clicking the button inside the link
		try {
			await unsubscribeFromCreator(creatorId);
			// Remove from list after successful unsubscribe
			setSubscriptions((prev) =>
				prev.filter((sub) => sub?.creatorId?._id !== creatorId),
			);
		} catch (error) {
			console.error('Failed to unsubscribe', error);
		}
	};

	return (
		<div className="min-h-screen">
			<Header />

			{/* Hero Section */}
			<div className="border-b border-border bg-linear-to-r from-primary/10 via-secondary/10 to-primary/10">
				<div className="container mx-auto px-4 py-12">
					<h1 className="text-balance text-4xl font-bold">
						Your Subscriptions
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						Manage the creators you follow
					</p>
				</div>
			</div>

			{/* Channels Grid */}
			<div className="container mx-auto px-4 py-12">
				{loading ? (
					<div className="flex items-center justify-center py-12">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					</div>
				) : subscriptions.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
						<Bell className="mb-4 h-12 w-12 opacity-50" />
						<h2 className="text-xl font-semibold">No subscriptions yet</h2>
						<p className="mt-2">Discover channels to see them here.</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{subscriptions.map((sub) => (
							<Link
								key={sub._id}
								href={`/channel/${sub?.creatorId?._id}`}>
								<div className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
									{/* Avatar */}
									<div className="mb-4 flex items-center gap-4">
										<Avatar className="h-16 w-16">
											<AvatarImage
												src={sub?.creatorId?.avatarUrl}
												alt={sub?.creatorId?.displayName}
											/>
											<AvatarFallback>
												{sub?.creatorId?.displayName?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<h3 className="font-bold group-hover:text-primary">
													{sub?.creatorId?.displayName}
												</h3>
												{sub?.creatorId?.isVerified && (
													<Badge className="bg-primary text-primary-foreground">
														Verified
													</Badge>
												)}
											</div>
											<p className="text-sm text-muted-foreground line-clamp-1">
												{sub?.creatorId?.bio || 'No bio'}
											</p>
										</div>
									</div>

									{/* Stats */}
									<div className="mb-4 space-y-1 text-sm text-muted-foreground">
										<p>{sub?.creatorId?.stats?.subscribersCount} subscribers</p>
										<p>{sub?.creatorId?.stats?.totalVideos} videos</p>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2">
										<Button
											className="flex-1 bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
											onClick={(e) =>
												handleUnsubscribe(e, sub?.creatorId?._id)
											}>
											<BellOff className="mr-2 h-4 w-4" />
											Unsubscribe
										</Button>
										<Button
											variant="outline"
											className="flex-1 bg-transparent">
											<Play className="mr-2 h-4 w-4" />
											Visit
										</Button>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
