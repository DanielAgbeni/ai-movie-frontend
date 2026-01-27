'use client';

import { memo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, DollarSign, MoreVertical } from 'lucide-react';
import type { VideoData } from './types';

export interface VideoPerformanceCardProps {
	videos: VideoData[];
	title?: string;
	description?: string;
}

const VideoPerformanceItem = memo(function VideoPerformanceItem({
	video,
}: {
	video: VideoData;
}) {
	return (
		<div className="flex items-center gap-4">
			<div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg">
				<img
					src={video.thumbnail || '/placeholder.svg'}
					alt={video.title}
					className="h-full w-full object-cover"
				/>
				<div className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white">
					{video.duration}
				</div>
			</div>
			<div className="flex-1">
				<h4 className="mb-1 font-semibold leading-snug">{video.title}</h4>
				<div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
					<span className="flex items-center gap-1">
						<Eye className="h-3 w-3" />
						{(video.views / 1000000).toFixed(1)}M views
					</span>
					<span className="flex items-center gap-1">
						<DollarSign className="h-3 w-3" />${video.earnings.toFixed(2)}
					</span>
					<Badge variant="secondary">{video.status}</Badge>
				</div>
			</div>
			<Button
				variant="ghost"
				size="icon">
				<MoreVertical className="h-4 w-4" />
			</Button>
		</div>
	);
});

export const VideoPerformanceCard = memo(function VideoPerformanceCard({
	videos,
	title = 'Recent Performance',
	description = 'Your top performing videos this month',
}: VideoPerformanceCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{videos.map((video) => (
						<VideoPerformanceItem
							key={video.id}
							video={video}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
});
