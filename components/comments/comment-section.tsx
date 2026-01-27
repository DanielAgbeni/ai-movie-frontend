'use client';

import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';

interface CommentSectionProps {
	movieId: string;
	commentsCount?: number;
}

export function CommentSection({
	movieId,
	commentsCount = 0,
}: CommentSectionProps) {
	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<h2 className="mb-6 text-xl font-bold">
				{commentsCount > 0 ? `${commentsCount} Comments` : 'Comments'}
			</h2>

			{/* Add Comment */}
			<div className="mb-8">
				<CommentForm movieId={movieId} />
			</div>

			{/* Comments List */}
			<CommentList movieId={movieId} />
		</div>
	);
}
