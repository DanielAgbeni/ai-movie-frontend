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
	ThumbsDown,
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
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

interface CommentItemProps {
	comment: Comment;
	isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
	const { user } = useAuthStore();
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [isReplying, setIsReplying] = useState(false);
	const [showReplies, setShowReplies] = useState(false);

	// Optimistic state for likes (simplistic)
	const [likesCount, setLikesCount] = useState(comment.stats.likesCount);
	// We don't check "isLiked" from API yet unless we augment the Comment type or fetch status.
	// For now assuming we don't have "isLiked" on the comment object itself,
	// but the backend might need to return it.
	// The current API spec provided doesn't explicitly modify Comment to include "isLiked".
	// But `getComments` usually populates `isLiked` if auth.
	// Let's assume for now we don't know, or we track it locally after action.
	const [isLikedLocal, setIsLikedLocal] = useState(false); // Can't know initial state without API support

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
			// Toggle local state
			setIsLikedLocal(!isLikedLocal);
			setLikesCount((prev) => (isLikedLocal ? prev - 1 : prev + 1));
		},
		onError: () => {
			toast({
				title: 'Error',
				description: 'Failed to update like',
				variant: 'destructive',
			});
		},
	});

	const { mutate: removeComment, isPending: isDeleting } = useMutation({
		mutationFn: () => deleteComment(comment._id),
		onSuccess: () => {
			toast({ title: 'Success', description: 'Comment deleted' });
			queryClient.invalidateQueries({
				queryKey: [isReply ? 'replies' : 'comments'],
			});
		},
		onError: () => {
			toast({
				title: 'Error',
				description: 'Failed to delete comment',
				variant: 'destructive',
			});
		},
	});

	// Fetch replies if showing
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

	// Flatten replies
	// The response is array of comments. But with infinite query it's pages.
	// Wait, getReplies returns ApiRequestResponseType<CommentListResponse> locally defined which is Comment[]?
	// No, `sendPaginated` format implies structure { data: T[], meta: ... }
	// My api/engagement.ts types need to align with AxiosResponse<ApiResponse<T>>
	// getReplies returns ApiRequestResponseType<CommentListResponse>.

	const replies = repliesData?.pages.flatMap((page) => page.data.data) || [];

	const isOwner =
		user?._id === comment.userId._id || user?.email === comment.userId.email; // userId might be populated object or id string?
	// In `getComments` backend code: `.populate('userId', 'email')`.
	// So userId is an object { _id, email }.

	return (
		<div className="flex gap-3">
			<Avatar className={cn('h-10 w-10', isReply && 'h-8 w-8')}>
				<AvatarFallback>
					{comment.userId.email.charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold">
							{/* Display Name not in populated user, using email part */}
							{comment.userId.email.split('@')[0]}
						</span>
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

				{/* Show/Hide Replies Toggle */}
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

				{/* Replies List */}
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
