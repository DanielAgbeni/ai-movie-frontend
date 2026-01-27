'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getComments } from '@/api/engagement';
import { CommentItem } from './comment-item';
import { Loader2 } from 'lucide-react';

interface CommentListProps {
	movieId: string;
}

export function CommentList({ movieId }: CommentListProps) {
	const { ref, inView } = useInView();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		error,
	} = useInfiniteQuery({
		queryKey: ['comments', movieId],
		queryFn: ({ pageParam }) =>
			getComments(movieId, { cursor: pageParam as string, limit: 20 }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage?.data?.meta?.pagination?.nextCursor,
	});

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	if (status === 'pending') {
		return (
			<div className="py-8 text-center">
				<Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (status === 'error') {
		return (
			<div className="py-8 text-center text-destructive">
				Error loading comments
			</div>
		);
	}

	// data.pages is array of axios responses.
	// Each page.data is ApiResponse<CommentListResponse>.
	// CommentListResponse is Comment[].

	const comments = data.pages.flatMap((page) => page.data.data);

	if (comments.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				No comments yet. Be the first to share your thoughts!
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{comments.map((comment) => (
				<CommentItem
					key={comment._id}
					comment={comment}
				/>
			))}

			{/* Loading indicator for next page */}
			<div
				ref={ref}
				className="py-4 text-center">
				{isFetchingNextPage && (
					<Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
				)}
			</div>
		</div>
	);
}
