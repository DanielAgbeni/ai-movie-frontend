'use client';

import { useState } from 'react';
import {
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
	ThumbsUp,
	MessageCircle,
	MoreVertical,
	Trash2,
	Loader2,
} from 'lucide-react';
import {
	Comment,
	likeComment,
	unlikeComment,
	deleteComment,
	getReplies,
} from '@/api/engagement';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommentForm } from './comment-form';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CommentItemProps {
	comment: Comment;
	isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
	const { user } = useAuthStore();
	const queryClient = useQueryClient();
	const [isReplying, setIsReplying] = useState(false);
	const [showReplies, setShowReplies] = useState(false);

	const [likesCount, setLikesCount] = useState(comment.stats.likesCount);
	const [isLikedLocal, setIsLikedLocal] = useState(false); // Can be enhanced with actual liked status from API

	const { mutate: toggleLike } = useMutation({
		mutationFn: async () => {
			if (isLikedLocal) {
				await unlikeComment(comment._id);
				return;
			} else {
				await likeComment(comment._id);
				return;
			}
		},
		onSuccess: () => {
			setIsLikedLocal(!isLikedLocal);
			setLikesCount((prev) => (isLikedLocal ? prev - 1 : prev + 1));
		},
		onError: (error: any) => {
			toast.error('Error', {
				description: error.response?.data?.message || 'Failed to update like',
			});
		},
	});

	const { mutate: removeComment, isPending: isDeleting } = useMutation({
		mutationFn: () => deleteComment(comment._id),
		onSuccess: () => {
			toast.success('Success', { description: 'Comment deleted' });
			queryClient.invalidateQueries({
				queryKey: [isReply ? 'replies' : 'comments'],
			});
		},
		onError: (error: any) => {
			toast.error('Error', {
				description: 'Failed to delete comment',
			});
		},
	});

	const {
		data: repliesData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isLoadingReplies,
	} = useInfiniteQuery({
		queryKey: ['replies', comment._id],
		queryFn: ({ pageParam }) =>
			getReplies(comment._id, { cursor: pageParam as string, limit: 10 }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage?.data?.meta?.pagination?.nextCursor,
		enabled: showReplies,
	});

	const replies = repliesData?.pages.flatMap((page) => page.data.data) || [];

	const isOwner =
		user?._id === comment.userId._id || user?.email === comment.userId.email;

	const displayName = comment.userId.name || comment.userId.email.split('@')[0];

	return (
		<div className="flex gap-3">
			<Avatar className={cn('h-10 w-10', isReply && 'h-8 w-8')}>
				{comment.userId.avatarUrl && (
					<AvatarImage src={comment.userId.avatarUrl} />
				)}
				<AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
			</Avatar>
			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold">{displayName}</span>
						<span className="text-xs text-muted-foreground">
							{formatDistanceToNow(new Date(comment.createdAt), {
								addSuffix: true,
							})}
						</span>
					</div>
					{isOwner && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={() => removeComment()}
									disabled={isDeleting}>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>

				<p className="text-sm leading-relaxed whitespace-pre-wrap">
					{comment.body}
				</p>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						className={cn('h-8 px-2 space-x-1', isLikedLocal && 'text-primary')}
						onClick={() => toggleLike()}>
						<ThumbsUp className="h-3 w-3" />
						<span className="text-xs">{likesCount}</span>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 px-2"
						onClick={() => setIsReplying(!isReplying)}>
						<MessageCircle className="mr-1 h-3 w-3" />
						<span className="text-xs">Reply</span>
					</Button>
				</div>

				{isReplying && (
					<div className="mt-4">
						<CommentForm
							movieId={comment.movieId}
							parentId={comment._id}
							onSuccess={() => {
								setIsReplying(false);
								setShowReplies(true);
							}}
							onCancel={() => setIsReplying(false)}
							autoFocus
						/>
					</div>
				)}

				{comment.stats.repliesCount > 0 && !isReply && (
					<Button
						variant="link"
						size="sm"
						className="px-0 text-primary"
						onClick={() => setShowReplies(!showReplies)}>
						{showReplies
							? 'Hide Replies'
							: `View ${comment.stats.repliesCount} Replies`}
					</Button>
				)}

				{showReplies && (
					<div className="mt-4 space-y-4 pl-4 border-l-2 border-border/50">
						{isLoadingReplies && (
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						)}
						{replies.map((reply) => (
							<CommentItem
								key={reply._id}
								comment={reply}
								isReply
							/>
						))}
						{hasNextPage && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}>
								{isFetchingNextPage ? 'Loading...' : 'Load more replies'}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
