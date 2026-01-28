'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setupCreatorProfile } from '@/api/creator';
import { useAuthStore } from '@/store/useAuthStore';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const creatorSchema = z.object({
	displayName: z.string().min(2, 'Display name must be at least 2 characters'),
	bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
	website: z.string().optional().or(z.literal('')),
	twitter: z.string().optional().or(z.literal('')),
	instagram: z.string().optional().or(z.literal('')),
	youtube: z.string().optional().or(z.literal('')),
});

type CreatorFormValues = z.infer<typeof creatorSchema>;

type BecomeCreatorModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function BecomeCreatorModal({
	open,
	onOpenChange,
}: BecomeCreatorModalProps) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const user = useAuthStore((state) => state.user);
	const setAuth = useAuthStore((state) => state.setAuth);

	const form = useForm<CreatorFormValues>({
		resolver: zodResolver(creatorSchema),
		defaultValues: {
			displayName: '',
			bio: '',
			website: '',
			twitter: '',
			instagram: '',
			youtube: '',
		},
	});

	const setupMutation = useMutation({
		mutationFn: setupCreatorProfile,
		onSuccess: (response) => {
			// Update user role in auth store
			if (user) {
				setAuth({
					user: { ...user, role: 'creator' },
					accessToken: useAuthStore.getState().accessToken!,
					refreshToken: useAuthStore.getState().refreshToken!,
					expiresIn: useAuthStore.getState().expiresIn!,
				});
			}

			toast('Welcome, Creator!', {
				description: 'Your creator profile has been set up successfully.',
			});

			// Invalidate queries that depend on user role
			queryClient.invalidateQueries({ queryKey: ['user'] });

			onOpenChange(false);
			router.push('/upload');
		},
		onError: (error: any) => {
			toast.error('Error', {
				description:
					error.response?.data?.message || 'Failed to create creator profile',
			});
		},
	});

	const processUrl = (url: string | undefined | null) => {
		if (!url) return undefined;
		let processed = url.trim();
		if (!processed) return undefined;
		if (!/^https?:\/\//i.test(processed)) {
			processed = `https://${processed}`;
		}
		return processed;
	};

	const onSubmit = (data: CreatorFormValues) => {
		const socialLinks: any = {};

		const website = processUrl(data.website);
		const twitter = processUrl(data.twitter);
		const instagram = processUrl(data.instagram);
		const youtube = processUrl(data.youtube);

		if (website) socialLinks.website = website;
		if (twitter) socialLinks.twitter = twitter;
		if (instagram) socialLinks.instagram = instagram;
		if (youtube) socialLinks.youtube = youtube;

		setupMutation.mutate({
			displayName: data.displayName,
			bio: data.bio || undefined,
			socialLinks:
				Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
		});
	};

	const handleUrlBlur = (
		field: 'website' | 'twitter' | 'instagram' | 'youtube',
		value: string,
	) => {
		const processed = processUrl(value);
		if (processed) {
			form.setValue(field, processed, { shouldValidate: true });
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-2xl">
						<Sparkles className="h-6 w-6 text-primary" />
						Become a Creator
					</DialogTitle>
					<DialogDescription>
						Set up your creator profile and start uploading your AI-generated
						movies to earn from your creativity.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 mt-4">
						{/* Display Name */}
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Display Name <span className="text-destructive">*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Your creator name"
											maxLength={100}
											{...field}
										/>
									</FormControl>
									<p className="text-xs text-muted-foreground">
										This is how your name will appear on your profile and
										videos.
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Bio */}
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Tell viewers about yourself and your content..."
											maxLength={1000}
											rows={4}
											{...field}
										/>
									</FormControl>
									<p className="text-xs text-muted-foreground">
										{field.value?.length || 0}/1000 characters
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Social Links */}
						<div className="space-y-4">
							<Label>Social Links (Optional)</Label>

							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="website"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-normal">
												Website
											</FormLabel>
											<FormControl>
												<Input
													placeholder="https://yourwebsite.com"
													{...field}
													onBlur={(e) => {
														field.onBlur();
														handleUrlBlur('website', e.target.value);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="twitter"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-normal">
												Twitter/X
											</FormLabel>
											<FormControl>
												<Input
													placeholder="https://twitter.com/username"
													{...field}
													onBlur={(e) => {
														field.onBlur();
														handleUrlBlur('twitter', e.target.value);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="instagram"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-normal">
												Instagram
											</FormLabel>
											<FormControl>
												<Input
													placeholder="https://instagram.com/username"
													{...field}
													onBlur={(e) => {
														field.onBlur();
														handleUrlBlur('instagram', e.target.value);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="youtube"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-normal">
												YouTube
											</FormLabel>
											<FormControl>
												<Input
													placeholder="https://youtube.com/@username"
													{...field}
													onBlur={(e) => {
														field.onBlur();
														handleUrlBlur('youtube', e.target.value);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Benefits Section */}
						<div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-2">
							<h4 className="font-semibold text-sm">Creator Benefits:</h4>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• Upload and monetize your AI-generated movies</li>
								<li>• Set your own rental and purchase prices</li>
								<li>• Access detailed analytics and earnings dashboard</li>
								<li>• Build your audience with subscribers</li>
							</ul>
						</div>

						{/* Actions */}
						<div className="flex gap-3 justify-end pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={setupMutation.isPending}>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={setupMutation.isPending}>
								{setupMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating Profile...
									</>
								) : (
									<>
										<Sparkles className="mr-2 h-4 w-4" />
										Create Creator Profile
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
