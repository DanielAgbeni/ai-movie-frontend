'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setupCreatorProfile } from '@/api/creator';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/use-toast';
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

type BecomeCreatorModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function BecomeCreatorModal({
	open,
	onOpenChange,
}: BecomeCreatorModalProps) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const user = useAuthStore((state) => state.user);
	const setAuth = useAuthStore((state) => state.setAuth);

	const [displayName, setDisplayName] = useState('');
	const [bio, setBio] = useState('');
	const [website, setWebsite] = useState('');
	const [twitter, setTwitter] = useState('');
	const [instagram, setInstagram] = useState('');
	const [youtube, setYoutube] = useState('');

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

			toast({
				title: 'Welcome, Creator!',
				description: 'Your creator profile has been set up successfully.',
			});

			// Invalidate queries that depend on user role
			queryClient.invalidateQueries({ queryKey: ['user'] });

			onOpenChange(false);
		},
		onError: (error: any) => {
			toast({
				title: 'Error',
				description:
					error.response?.data?.message ||
					'Failed to create creator profile',
				variant: 'destructive',
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!displayName.trim()) {
			toast({
				title: 'Required',
				description: 'Please enter a display name',
				variant: 'destructive',
			});
			return;
		}

		const socialLinks: any = {};
		if (website) socialLinks.website = website;
		if (twitter) socialLinks.twitter = twitter;
		if (instagram) socialLinks.instagram = instagram;
		if (youtube) socialLinks.youtube = youtube;

		setupMutation.mutate({
			displayName: displayName.trim(),
			bio: bio.trim() || undefined,
			socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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

				<form onSubmit={handleSubmit} className="space-y-6 mt-4">
					{/* Display Name */}
					<div className="space-y-2">
						<Label htmlFor="displayName">
							Display Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="displayName"
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder="Your creator name"
							maxLength={100}
							required
						/>
						<p className="text-xs text-muted-foreground">
							This is how your name will appear on your profile and videos.
						</p>
					</div>

					{/* Bio */}
					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea
							id="bio"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							placeholder="Tell viewers about yourself and your content..."
							maxLength={1000}
							rows={4}
						/>
						<p className="text-xs text-muted-foreground">
							{bio.length}/1000 characters
						</p>
					</div>

					{/* Social Links */}
					<div className="space-y-4">
						<Label>Social Links (Optional)</Label>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="website" className="text-sm font-normal">
									Website
								</Label>
								<Input
									id="website"
									type="url"
									value={website}
									onChange={(e) => setWebsite(e.target.value)}
									placeholder="https://yourwebsite.com"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="twitter" className="text-sm font-normal">
									Twitter/X
								</Label>
								<Input
									id="twitter"
									type="url"
									value={twitter}
									onChange={(e) => setTwitter(e.target.value)}
									placeholder="https://twitter.com/username"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="instagram" className="text-sm font-normal">
									Instagram
								</Label>
								<Input
									id="instagram"
									type="url"
									value={instagram}
									onChange={(e) => setInstagram(e.target.value)}
									placeholder="https://instagram.com/username"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="youtube" className="text-sm font-normal">
									YouTube
								</Label>
								<Input
									id="youtube"
									type="url"
									value={youtube}
									onChange={(e) => setYoutube(e.target.value)}
									placeholder="https://youtube.com/@username"
								/>
							</div>
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
						<Button type="submit" disabled={setupMutation.isPending}>
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
			</DialogContent>
		</Dialog>
	);
}
