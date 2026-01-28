'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/api/engagement';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';

interface CommentFormProps {
	movieId: string;
	parentId?: string;
	onSuccess?: () => void;
	onCancel?: () => void;
	autoFocus?: boolean;
	placeholder?: string;
}

const commentSchema = z.object({
	body: z.string().min(1, 'Comment cannot be empty'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export function CommentForm({
	movieId,
	parentId,
	onSuccess,
	onCancel,
	autoFocus = false,
	placeholder = 'Add a comment...',
}: CommentFormProps) {
	const { user, isAuthenticated } = useAuthStore();
	const queryClient = useQueryClient();

	const form = useForm<CommentFormValues>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			body: '',
		},
	});

	const { mutate: submitComment, isPending } = useMutation({
		mutationFn: (data: CommentFormValues) =>
			createComment(movieId, data.body, parentId),
		onSuccess: () => {
			form.reset();
			toast.success('Success', {
				description: 'Comment posted successfully',
			});
			// Invalidate comments query to refetch
			if (parentId) {
				queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
			} else {
				queryClient.invalidateQueries({ queryKey: ['comments', movieId] });
			}
			onSuccess?.();
		},
		onError: (error: any) => {
			toast.error('Error', {
				description: error.response?.data?.message || 'Failed to post comment',
			});
		},
	});

	const onSubmit = (data: CommentFormValues) => {
		if (!isAuthenticated) {
			toast.error('Unauthorized', {
				description: 'Please sign in to comment',
			});
			return;
		}

		submitComment(data);
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
				{user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
				<AvatarFallback>
					{user?.email?.charAt(0).toUpperCase() || 'U'}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="body"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder={placeholder}
											className="min-h-20 border-border bg-secondary resize-none"
											autoFocus={autoFocus}
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="mt-2 flex justify-end gap-2">
							{onCancel && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={onCancel}
									disabled={isPending}>
									Cancel
								</Button>
							)}
							<Button
								type="submit"
								size="sm"
								className="bg-primary text-primary-foreground hover:bg-primary/90"
								disabled={!form.formState.isValid || isPending}>
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
					</form>
				</Form>
			</div>
		</div>
	);
}
