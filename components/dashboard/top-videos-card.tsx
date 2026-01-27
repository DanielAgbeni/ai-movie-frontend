'use client';

import { memo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { VideoData } from './types';

export interface TopVideosCardProps {
	videos: VideoData[];
	title?: string;
	description?: string;
}

const TopVideoItem = memo(function TopVideoItem({
	video,
	rank,
}: {
	video: VideoData;
	rank: number;
}) {
	return (
		<div className="flex items-center gap-4">
			<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
				{rank}
			</div>
			<Avatar className="h-12 w-12">
				<AvatarImage
					src={video.thumbnail || '/placeholder.svg'}
					alt={video.title}
				/>
				<AvatarFallback>V</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<p className="font-semibold leading-snug">{video.title}</p>
				<p className="text-sm text-muted-foreground">
					{(video.views / 1000000).toFixed(1)}M views • $
					{video.earnings.toFixed(2)} earned
				</p>
			</div>
		</div>
	);
});

export const TopVideosCard = memo(function TopVideosCard({
	videos,
	title = 'Top Performing Videos',
	description = 'Based on views and engagement',
}: TopVideosCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{videos.map((video, index) => (
						<TopVideoItem
							key={video.id}
							video={video}
							rank={index + 1}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
});
