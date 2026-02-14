'use client';

import { useState } from 'react';
import { AdminComment } from '@/api/admin';
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
import { MoreHorizontal, Trash2, Loader2 } from 'lucide-react';
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
import { takedownComment } from '@/api/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CommentsTableProps {
	comments: AdminComment[];
	pagination: PaginationType;
	isLoading: boolean;
}

export function CommentsTable({ comments, isLoading }: CommentsTableProps) {
	const queryClient = useQueryClient();
	const [selectedComment, setSelectedComment] = useState<AdminComment | null>(
		null,
	);

	const { mutate: handleDelete, isPending } = useMutation({
		mutationFn: (id: string) => takedownComment(id),
		onSuccess: () => {
			toast({ title: 'Comment taken down successfully' });
			queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
			setSelectedComment(null);
		},
		onError: () =>
			toast({ title: 'Failed to take down comment', variant: 'destructive' }),
	});

	const confirmAction = () => {
		if (!selectedComment) return;
		handleDelete(selectedComment._id);
	};

	if (isLoading) {
		return <div>Loading comments...</div>;
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[400px]">Content</TableHead>
							<TableHead>Author</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{comments.map((comment) => (
							<TableRow key={comment._id}>
								<TableCell>
									<p className="line-clamp-2 text-sm">{comment.body}</p>
									{comment.parentId && (
										<Badge
											variant="secondary"
											className="mt-1 text-xs">
											Reply
										</Badge>
									)}
								</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<span className="font-medium text-sm">
											{comment.userId?.email || 'Unknown User'}
										</span>
										<span className="text-xs text-muted-foreground">
											{comment.userId?._id}
										</span>
									</div>
								</TableCell>
								<TableCell>
									{comment.isDeleted ? (
										<Badge variant="destructive">Deleted</Badge>
									) : (
										<Badge variant="outline">Active</Badge>
									)}
								</TableCell>
								<TableCell>
									{format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
								</TableCell>
								<TableCell className="text-right">
									{!comment.isDeleted && (
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
												<DropdownMenuItem
													onClick={() => setSelectedComment(comment)}
													className="text-red-600 focus:text-red-600">
													<Trash2 className="mr-2 h-4 w-4" /> Takedown
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={!!selectedComment}
				onOpenChange={(open) =>
					!open && !isPending && setSelectedComment(null)
				}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Takedown Comment</DialogTitle>
						<DialogDescription>
							Are you sure you want to take down this comment?
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setSelectedComment(null)}
							disabled={isPending}>
							Cancel
						</Button>
						<Button
							variant="destructive"
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
