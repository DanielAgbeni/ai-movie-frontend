'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, EyeOff, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { takedownMovie, restoreMovie } from '@/api/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

interface MoviesTableProps {
	movies: Movie[];
	pagination: PaginationType;
	isLoading: boolean;
}

export function MoviesTable({ movies, isLoading }: MoviesTableProps) {
	const queryClient = useQueryClient();
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [actionType, setActionType] = useState<'takedown' | 'restore' | null>(
		null,
	);

	const { mutate: handleTakedown, isPending: isTakingDown } = useMutation({
		mutationFn: (id: string) => takedownMovie(id),
		onSuccess: () => {
			toast({ title: 'Movie taken down successfully' });
			queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
			setSelectedMovie(null);
		},
		onError: () =>
			toast({ title: 'Failed to take down movie', variant: 'destructive' }),
	});

	const { mutate: handleRestore, isPending: isRestoring } = useMutation({
		mutationFn: (id: string) => restoreMovie(id),
		onSuccess: () => {
			toast({ title: 'Movie restored successfully' });
			queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
			setSelectedMovie(null);
		},
		onError: () =>
			toast({ title: 'Failed to restore movie', variant: 'destructive' }),
	});

	const isPending = isTakingDown || isRestoring;

	const confirmAction = () => {
		if (!selectedMovie) return;

		if (actionType === 'takedown') {
			handleTakedown(selectedMovie._id);
		} else if (actionType === 'restore') {
			handleRestore(selectedMovie._id);
		}
	};

	if (isLoading) {
		return <div>Loading movies...</div>;
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Movie</TableHead>
							<TableHead>Creator</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Published</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{movies.map((movie) => (
							<TableRow key={movie._id}>
								<TableCell className="flex items-center gap-3">
									<div className="relative h-10 w-16 overflow-hidden rounded bg-muted">
										{movie.thumbnail?.url && (
											<Image
												src={movie.thumbnail.url}
												alt={movie.title}
												fill
												className="object-cover"
											/>
										)}
									</div>
									<div className="flex flex-col">
										<span className="font-medium line-clamp-1 max-w-[200px]">
											{movie.title}
										</span>
										<span className="text-xs text-muted-foreground">
											{Math.floor(movie.durationSec / 60)} mins
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<span className="text-sm">
											{movie.creatorId?.displayName || 'Unknown'}
										</span>
									</div>
								</TableCell>
								<TableCell>
									{movie.isDeleted ? (
										<Badge variant="destructive">Taken Down</Badge>
									) : (
										<Badge
											variant="outline"
											className="text-green-600 border-green-200 bg-green-50">
											Active
										</Badge>
									)}
									<span className="ml-2 text-xs text-muted-foreground capitalize">
										{movie.visibility}
									</span>
								</TableCell>
								<TableCell>
									{format(new Date(movie.createdAt), 'MMM d, yyyy')}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											{movie.isDeleted ? (
												<DropdownMenuItem
													onClick={() => {
														setSelectedMovie(movie);
														setActionType('restore');
													}}
													className="text-green-600 focus:text-green-600">
													<Eye className="mr-2 h-4 w-4" /> Restore
												</DropdownMenuItem>
											) : (
												<DropdownMenuItem
													onClick={() => {
														setSelectedMovie(movie);
														setActionType('takedown');
													}}
													className="text-red-600 focus:text-red-600">
													<EyeOff className="mr-2 h-4 w-4" /> Takedown (Soft
													Delete)
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={!!selectedMovie}
				onOpenChange={(open) => !open && !isPending && setSelectedMovie(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{actionType === 'takedown' && 'Takedown Movie'}
							{actionType === 'restore' && 'Restore Movie'}
						</DialogTitle>
						<DialogDescription>
							{actionType === 'takedown' &&
								`Are you sure you want to take down "${selectedMovie?.title}"? It will be hidden from public view.`}
							{actionType === 'restore' &&
								`Are you sure you want to restore "${selectedMovie?.title}"?`}
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setSelectedMovie(null)}
							disabled={isPending}>
							Cancel
						</Button>
						<Button
							variant={actionType === 'takedown' ? 'destructive' : 'default'}
							onClick={confirmAction}
							disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
