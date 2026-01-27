'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Play, Edit, Download, Trash2 } from 'lucide-react';

export interface VideoListCardProps {
	videos?: Movie[];
	title?: string;
	description?: string;
	onWatch?: (video: Movie) => void;
	onEdit?: (video: Movie) => void;
	onDownload?: (video: Movie) => void;
	onDelete?: (video: Movie) => void;
}

interface VideoListItemProps {
	video: Movie;
	onWatch?: (video: Movie) => void;
	onEdit?: (video: Movie) => void;
	onDownload?: (video: Movie) => void;
	onDelete?: (video: Movie) => void;
}

const VideoListItem = memo(function VideoListItem({
	video,
	onWatch,
	onEdit,
	onDownload,
	onDelete,
}: VideoListItemProps) {
	const thumbnailUrl =
		video.thumbnail?.secureUrl || video.thumbnail?.url || '/placeholder.svg';
	const viewsCount = video.stats?.viewsCount ?? 0;
	const createdDate = video.createdAt
		? new Date(video.createdAt).toLocaleDateString()
		: 'Unknown';

	return (
		<div className="flex items-center gap-4 rounded-lg border border-border p-4">
			<div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg">
				<img
					src={thumbnailUrl}
					alt={video.title}
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="flex-1">
				<h4 className="mb-2 font-semibold">{video.title}</h4>
				<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
					<span>{viewsCount.toLocaleString()} views</span>
					<span>•</span>
					<span>{createdDate}</span>
					<span>•</span>
					<Badge variant="secondary">{video.visibility}</Badge>
				</div>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => onWatch?.(video)}>
						<Play className="mr-2 h-4 w-4" />
						Watch
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onEdit?.(video)}>
						<Edit className="mr-2 h-4 w-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onDownload?.(video)}>
						<Download className="mr-2 h-4 w-4" />
						Download
					</DropdownMenuItem>
					<DropdownMenuItem
						className="text-destructive"
						onClick={() => onDelete?.(video)}>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
});

export const VideoListCard = memo(function VideoListCard({
	videos = [],
	title = 'Your Videos',
	description = 'Manage your uploaded content',
	onWatch,
	onEdit,
	onDownload,
	onDelete,
}: VideoListCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<Button
					asChild
					className="bg-primary text-primary-foreground hover:bg-primary/90">
					<Link href="/upload">Upload New</Link>
				</Button>
			</CardHeader>
			<CardContent>
				{videos.length === 0 ? (
					<div className="py-8 text-center text-muted-foreground">
						<p>No videos yet. Upload your first video to get started!</p>
					</div>
				) : (
					<div className="space-y-4">
						{videos.map((video) => (
							<VideoListItem
								key={video._id}
								video={video}
								onWatch={onWatch}
								onEdit={onEdit}
								onDownload={onDownload}
								onDelete={onDelete}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
});
