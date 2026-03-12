'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminMovie } from '@/api/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface MovieDetailsDialogProps {
	movieId: string | null;
	onOpenChange: (open: boolean) => void;
}

export function MovieDetailsDialog({ movieId, onOpenChange }: MovieDetailsDialogProps) {
	const { data, isLoading } = useQuery({
		queryKey: ['admin-movie-details', movieId],
		queryFn: () => getAdminMovie(movieId!),
		enabled: !!movieId,
	});

	const detailedData = data?.data?.data;
	const movie = detailedData?.movie;
	const revenue = detailedData?.revenue;

	return (
		<Dialog open={!!movieId} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Movie Details</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<div className="flex justify-center p-8">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : movie ? (
					<div className="space-y-6">
						<div className="flex gap-6">
							{movie.thumbnail?.url && (
								<img src={movie.thumbnail.url} alt={movie.title} className="w-48 rounded-md object-cover aspect-video" />
							)}
							<div className="flex-1">
								<h3 className="text-2xl font-bold">{movie.title}</h3>
								<div className="flex items-center gap-2 mt-2">
									<Badge variant={movie.isDeleted ? 'destructive' : 'default'}>
										{movie.isDeleted ? 'Taken Down' : 'Active'}
									</Badge>
									<span className="text-sm text-muted-foreground capitalize">
										{movie.visibility}
									</span>
									<span className="text-sm text-muted-foreground">
										• {Math.floor(movie.durationSec / 60)} mins
									</span>
								</div>
								{movie.description && (
									<p className="mt-3 text-sm text-muted-foreground">
										{movie.description}
									</p>
								)}
								<p className="mt-2 text-xs text-muted-foreground">
									Published: {format(new Date(movie.createdAt), 'PPpp')}
								</p>
							</div>
						</div>

						<Separator />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-4 bg-muted/30 p-4 rounded-lg">
								<h4 className="font-semibold text-lg border-b pb-2">Creator Info</h4>
								<div className="text-sm space-y-3">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Name:</span>
										<span className="font-medium">{movie.creatorId?.displayName || 'Unknown'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Username:</span>
										<span className="font-medium">@{(movie.creatorId as any)?.username || 'unknown'}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Email:</span>
										<span className="font-medium">{(movie.creatorId as any)?.userId?.email || 'N/A'}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Role:</span>
										{(movie.creatorId as any)?.userId?.role ? (
											<Badge variant="secondary" className="capitalize">
												{(movie.creatorId as any)?.userId?.role}
											</Badge>
										) : (
											<span>N/A</span>
										)}
									</div>
								</div>
							</div>

							<div className="space-y-4 bg-muted/30 p-4 rounded-lg">
								<h4 className="font-semibold text-lg border-b pb-2">Stats & Revenue</h4>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-3 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Views:</span>
											<span className="font-medium">{movie.stats?.viewsCount?.toLocaleString() || 0}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Likes:</span>
											<span className="font-medium">{movie.stats?.likesCount?.toLocaleString() || 0}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Comments:</span>
											<span className="font-medium">{movie.stats?.commentsCount?.toLocaleString() || 0}</span>
										</div>
									</div>
									<div className="space-y-3 text-sm border-l pl-4">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Orders:</span>
											<span className="font-medium">{revenue?.ordersCount?.toLocaleString() || 0}</span>
										</div>
										<div className="flex justify-between font-semibold text-green-600">
											<span>Revenue:</span>
											<span>${((revenue?.totalCents || 0) / 100).toFixed(2)}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="p-8 text-center text-muted-foreground">Failed to load movie details.</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
