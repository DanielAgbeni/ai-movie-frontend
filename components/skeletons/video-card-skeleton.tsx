import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VideoCardSkeleton() {
	return (
		<Card className="group overflow-hidden border-border bg-card">
			{/* Thumbnail Skeleton */}
			<div className="relative aspect-video overflow-hidden bg-muted">
				<Skeleton className="h-full w-full" />
			</div>

			{/* Content Skeleton */}
			<div className="p-3">
				<div className="flex gap-3">
					{/* Avatar Skeleton */}
					<Skeleton className="h-9 w-9 rounded-full shrink-0" />

					<div className="flex-1 space-y-2">
						{/* Title Skeleton */}
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />

						{/* Creator Name Skeleton */}
						<Skeleton className="h-3 w-1/2" />

						{/* Meta Skeleton */}
						<div className="flex items-center gap-2 pt-1">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-3 w-3 rounded-full" />
							<Skeleton className="h-3 w-16" />
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
