'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/api/engagement';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentFormProps {
	movieId: string;
	parentId?: string;
	onSuccess?: () => void;
	onCancel?: () => void;
	autoFocus?: boolean;
	placeholder?: string;
}

export function CommentForm({
	movieId,
	parentId,
	onSuccess,
	onCancel,
	autoFocus = false,
	placeholder = 'Add a comment...',
}: CommentFormProps) {
	const [body, setBody] = useState('');
	const { user, isAuthenticated } = useAuthStore();
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const { mutate: submitComment, isPending } = useMutation({
		mutationFn: () => createComment(movieId, body, parentId),
		onSuccess: () => {
			setBody('');
			toast({
				title: 'Success',
				description: 'Comment posted successfully',
			});
			// Invalidate comments query to refetch
			if (parentId) {
				queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
				// Also invalidate key stats of the parent comment if we were tracking reply count locally?
				// For now, refreshing replies list is key.
				// We might also want to update the parent comment's reply count in the cache.
			} else {
				queryClient.invalidateQueries({ queryKey: ['comments', movieId] });
			}
			onSuccess?.();
		},
		onError: (error: any) => {
			toast({
				title: 'Error',
				description: error.response?.data?.message || 'Failed to post comment',
				variant: 'destructive',
			});
		},
	});

	const handleSubmit = () => {
		if (!isAuthenticated) {
			toast({
				title: 'Unauthorized',
				description: 'Please sign in to comment',
				variant: 'destructive',
			});
			return;
		}

		if (!body.trim()) return;

		submitComment();
	};

	if (!isAuthenticated) {
		return (
			<div className="rounded-lg border border-border bg-card p-4 text-center">
				<p className="text-muted-foreground mb-2">Sign in to comment</p>
				<Button
					variant="outline"
					asChild>
					<a href="/login">Sign In</a>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex gap-3">
			<Avatar className="h-10 w-10">
				{/* We don't have user avatar url in store yet? Assuming simplified user object */}
				<AvatarFallback>
					{user?.email?.charAt(0).toUpperCase() || 'U'}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<Textarea
					value={body}
					onChange={(e) => setBody(e.target.value)}
					placeholder={placeholder}
					className="min-h-20 border-border bg-secondary resize-none"
					autoFocus={autoFocus}
					disabled={isPending}
				/>
				<div className="mt-2 flex justify-end gap-2">
					{onCancel && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onCancel}
							disabled={isPending}>
							Cancel
						</Button>
					)}
					<Button
						size="sm"
						className="bg-primary text-primary-foreground hover:bg-primary/90"
						onClick={handleSubmit}
						disabled={!body.trim() || isPending}>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-3 w-3 animate-spin" />
								Posting...
							</>
						) : (
							<>
								<Send className="mr-2 h-3 w-3" />
								Comment
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
