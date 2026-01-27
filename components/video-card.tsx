import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Play, DollarSign } from 'lucide-react';

export interface VideoCardProps {
	id: string;
	title: string;
	thumbnail: string;
	creator: {
		name: string;
		avatar: string;
	};
	views: string;
	uploadDate: string;
	duration: string;
	price?: {
		rent?: number;
		buy?: number;
	};
	isPremium?: boolean;
}

export function VideoCard({
	id,
	title,
	thumbnail,
	creator,
	views,
	uploadDate,
	duration,
	price,
	isPremium,
}: VideoCardProps) {
	return (
		<Link href={`/watch/${id}`}>
			<Card className="group overflow-hidden border-border bg-card transition-all hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20">
				{/* Thumbnail */}
				<div className="relative aspect-video overflow-hidden bg-muted">
					<img
						src={thumbnail || '/placeholder.svg'}
						alt={title}
						className="h-full w-full object-cover transition-transform group-hover:scale-105"
					/>
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
							<Play className="h-6 w-6 fill-primary-foreground" />
						</div>
					</div>
					<div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white">
						{duration}
					</div>
					{isPremium && (
						<Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground border-0">
							Premium
						</Badge>
					)}
				</div>

				{/* Content */}
				<div className="p-3">
					<div className="flex gap-3">
						<Avatar className="h-9 w-9 border border-primary/30">
							<AvatarImage
								src={creator.avatar || '/placeholder.svg'}
								alt={creator.name}
							/>
							<AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
						</Avatar>

						<div className="flex-1 space-y-1">
							<h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
								{title}
							</h3>
							<p className="text-xs text-muted-foreground">{creator.name}</p>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>{views} views</span>
								<span>•</span>
								<span>{uploadDate}</span>
							</div>
							{price && (
								<div className="flex items-center gap-3 pt-1">
									{price.rent && (
										<span className="flex items-center gap-1 text-xs font-semibold text-primary">
											<DollarSign className="h-3 w-3" />
											{price.rent} Rent
										</span>
									)}
									{price.buy && (
										<span className="flex items-center gap-1 text-xs font-semibold text-primary">
											<DollarSign className="h-3 w-3" />
											{price.buy} Buy
										</span>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
}
