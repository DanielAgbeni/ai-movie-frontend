'use client';
import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	User,
	Bell,
	Shield,
	CreditCard,
	Monitor,
	Globe,
	Camera,
	Link as LinkIcon,
	Loader2,
} from 'lucide-react';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Header } from '@/components/header';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { getCreatorProfile, updateCreatorProfile } from '@/api/creator';
import { getCloudinarySignature } from '@/api/upload';
import {
	useNotificationPreferences,
	useUpdateNotificationPreferences,
} from '@/hooks/useNotifications';
import { toast } from 'sonner';

const profileSchema = z.object({
	displayName: z.string().min(2, 'Name must be at least 2 characters'),
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.regex(
			/^[a-zA-Z0-9_]+$/,
			'Username can only contain letters, numbers, and underscores',
		),
	bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
	socialLinks: z
		.object({
			website: z.string().url('Invalid URL').optional().or(z.literal('')),
			twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
			instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
			youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
		})
		.optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
	const queryClient = useQueryClient();
	const [avatar, setAvatar] = useState<string | null>(null);
	const [banner, setBanner] = useState<string | null>(null);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [isUploadingBanner, setIsUploadingBanner] = useState(false);

	// Cropper State
	const [cropperOpen, setCropperOpen] = useState(false);
	const [cropperImg, setCropperImg] = useState<string | null>(null);
	const [cropType, setCropType] = useState<'avatar' | 'banner'>('avatar');

	const avatarInputRef = useRef<HTMLInputElement>(null);
	const bannerInputRef = useRef<HTMLInputElement>(null);

	// Fetch Profile Data
	const { data: profileData, isLoading } = useQuery({
		queryKey: ['creatorProfile'],
		queryFn: getCreatorProfile,
	});

	const creator = profileData?.data?.data?.creator;

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			displayName: '',
			username: '',
			bio: '',
			socialLinks: {
				website: '',
				twitter: '',
				instagram: '',
				youtube: '',
			},
		},
	});

	// Populate form when data is loaded
	useEffect(() => {
		if (creator) {
			form.reset({
				displayName: creator.displayName || '',
				username: (creator as any).username || '', // Cast to any if username is not in CreatorProfile yet
				bio: creator.bio || '',
				socialLinks: {
					website: creator.socialLinks?.website || '',
					twitter: creator.socialLinks?.twitter || '',
					instagram: creator.socialLinks?.instagram || '',
					youtube: creator.socialLinks?.youtube || '',
				},
			});
			setAvatar(creator.avatarUrl || null);
			setBanner(creator.bannerUrl || null);
		}
	}, [creator, form]);

	// Update Mutation
	const updateMutation = useMutation({
		mutationFn: (
			data: ProfileFormValues & { avatarUrl?: string; bannerUrl?: string },
		) => updateCreatorProfile(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['creatorProfile'] });
			toast('Profile Updated', {
				description: 'Your profile has been successfully updated.',
			});
		},
		onError: (error: any) => {
			toast('Update Failed', {
				description:
					error.response?.data?.message || 'Failed to update profile.',
			});
		},
	});

	const onSubmit = (data: ProfileFormValues) => {
		updateMutation.mutate({
			...data,
			avatarUrl: avatar || undefined,
			bannerUrl: banner || undefined,
		});
	};

	const handleImageSelect = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: 'avatar' | 'banner',
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			toast('Invalid File', {
				description: 'Please select an image file.',
			});
			return;
		}

		console.log('Selected file:', file.name, type); // Debug

		const reader = new FileReader();
		reader.addEventListener('load', () => {
			console.log('File read, setting cropper src'); // Debug
			setCropperImg(reader.result as string);
			setCropType(type);
			setCropperOpen(true);
		});
		reader.readAsDataURL(file);
		// Reset input value to allow selecting the same file again
		e.target.value = '';
	};

	const onCropComplete = async (croppedBlob: Blob) => {
		console.log('Crop complete, blob size:', croppedBlob.size); // Debug
		const type = cropType;
		const setLoader =
			type === 'avatar' ? setIsUploadingAvatar : setIsUploadingBanner;
		const setUrl = type === 'avatar' ? setAvatar : setBanner;

		setLoader(true);

		try {
			const { data } = await getCloudinarySignature({
				folder: type === 'avatar' ? 'avatars' : 'banners',
			});
			const { signature, timestamp, cloudName, apiKey } = data.data;

			const formData = new FormData();
			formData.append('file', croppedBlob);
			formData.append('api_key', apiKey);
			formData.append('timestamp', timestamp.toString());
			formData.append('signature', signature);
			formData.append('folder', type === 'avatar' ? 'avatars' : 'banners');

			const res = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				{
					method: 'POST',
					body: formData,
				},
			);

			const uploadResult = await res.json();

			if (uploadResult.secure_url) {
				setUrl(uploadResult.secure_url);
				toast.success('Upload Successful', {
					description: `${type === 'avatar' ? 'Avatar' : 'Banner'} updated.`,
				});
			}
		} catch (error) {
			console.error('Upload failed', error);
			toast.error('Upload Failed', {
				description: 'Failed to upload image. Please try again.',
			});
		} finally {
			setLoader(false);
		}
	};

	// Other Settings State (Mock for now, preserving existing UI)
	const notificationPrefsQuery = useNotificationPreferences();
	const updatePreferencesMutation = useUpdateNotificationPreferences();

	const notificationPrefs = notificationPrefsQuery.data ?? {
		newFollowers: true,
		newComments: true,
		purchaseAlerts: true,
		weeklyDigest: false,
	};

	const handleNotificationChange = (
		key: keyof NotificationPreferences,
		value: boolean,
	) => {
		updatePreferencesMutation.mutate(
			{ [key]: value },
			{
				onSuccess: () => {
					toast.success('Preference updated');
				},
				onError: () => {
					toast.error('Failed to update preference');
				},
			},
		);
	};

	const [privacy, setPrivacy] = useState({
		profileVisible: true,
		showEmail: false,
		allowMessages: true,
	});

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold text-foreground mb-8">Settings</h1>

					<Tabs
						defaultValue="profile"
						className="space-y-6">
						<TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
							<TabsTrigger
								value="profile"
								className="gap-2">
								<User className="h-4 w-4" />
								<span className="hidden sm:inline">Profile</span>
							</TabsTrigger>
							<TabsTrigger
								value="notifications"
								className="gap-2">
								<Bell className="h-4 w-4" />
								<span className="hidden sm:inline">Notifications</span>
							</TabsTrigger>
							<TabsTrigger
								value="privacy"
								className="gap-2">
								<Shield className="h-4 w-4" />
								<span className="hidden sm:inline">Privacy</span>
							</TabsTrigger>
							<TabsTrigger
								value="billing"
								className="gap-2">
								<CreditCard className="h-4 w-4" />
								<span className="hidden sm:inline">Billing</span>
							</TabsTrigger>
							<TabsTrigger
								value="appearance"
								className="gap-2">
								<Monitor className="h-4 w-4" />
								<span className="hidden sm:inline">Appearance</span>
							</TabsTrigger>
							<TabsTrigger
								value="language"
								className="gap-2">
								<Globe className="h-4 w-4" />
								<span className="hidden sm:inline">Language</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="profile"
							className="space-y-6">
							<div className="bg-card border border-border rounded-lg p-6">
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Profile Information
								</h2>

								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-8">
										{/* Banner and Avatar Section */}
										<div className="relative mb-16">
											<div
												className="h-48 w-full rounded-lg bg-muted overflow-hidden relative cursor-pointer group"
												onClick={() => bannerInputRef.current?.click()}>
												{banner ? (
													<img
														src={banner}
														alt="Banner"
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-secondary">
														<span className="text-muted-foreground">
															Upload Banner
														</span>
													</div>
												)}
												<div
													className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${
														isUploadingBanner
															? 'opacity-100'
															: 'opacity-0 group-hover:opacity-100'
													}`}>
													{isUploadingBanner ? (
														<Loader2 className="h-8 w-8 text-white animate-spin" />
													) : (
														<Camera className="h-8 w-8 text-white" />
													)}
												</div>
												<input
													ref={bannerInputRef}
													type="file"
													accept="image/*"
													className="hidden"
													onChange={(e) => handleImageSelect(e, 'banner')}
												/>
											</div>

											<div className="absolute -bottom-12 left-6">
												<div
													className="relative group cursor-pointer"
													onClick={() => avatarInputRef.current?.click()}>
													<Avatar className="h-24 w-24 border-4 border-background">
														<AvatarImage src={avatar || undefined} />
														<AvatarFallback>
															{creator?.displayName?.[0]}
														</AvatarFallback>
													</Avatar>
													<div
														className={`absolute inset-0 rounded-full bg-black/40 transition-opacity flex items-center justify-center ${
															isUploadingAvatar
																? 'opacity-100'
																: 'opacity-0 group-hover:opacity-100'
														}`}>
														{isUploadingAvatar ? (
															<Loader2 className="h-6 w-6 text-white animate-spin" />
														) : (
															<Camera className="h-6 w-6 text-white" />
														)}
													</div>
													<input
														ref={avatarInputRef}
														type="file"
														accept="image/*"
														className="hidden"
														onChange={(e) => handleImageSelect(e, 'avatar')}
													/>
												</div>
											</div>
										</div>

										<div className="grid gap-6 md:grid-cols-2">
											<FormField
												control={form.control}
												name="displayName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Display Name</FormLabel>
														<FormControl>
															<Input
																placeholder="Your Name"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="username"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Username</FormLabel>
														<FormControl>
															<Input
																placeholder="username"
																{...field}
															/>
														</FormControl>
														<FormDescription>
															This is your public handle: @{field.value}
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="bio"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Bio</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Tell us about yourself..."
															className="min-h-[100px]"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="space-y-4">
											<h3 className="text-lg font-medium">Social Links</h3>
											<div className="grid gap-4 md:grid-cols-2">
												<FormField
													control={form.control}
													name="socialLinks.website"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Website</FormLabel>
															<FormControl>
																<div className="relative">
																	<LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
																	<Input
																		className="pl-9"
																		placeholder="https://example.com"
																		{...field}
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="socialLinks.twitter"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Twitter</FormLabel>
															<FormControl>
																<div className="relative">
																	<LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
																	<Input
																		className="pl-9"
																		placeholder="https://twitter.com/user"
																		{...field}
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="socialLinks.instagram"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Instagram</FormLabel>
															<FormControl>
																<div className="relative">
																	<LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
																	<Input
																		className="pl-9"
																		placeholder="https://instagram.com/user"
																		{...field}
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="socialLinks.youtube"
													render={({ field }) => (
														<FormItem>
															<FormLabel>YouTube</FormLabel>
															<FormControl>
																<div className="relative">
																	<LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
																	<Input
																		className="pl-9"
																		placeholder="https://youtube.com/@user"
																		{...field}
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>

										<div className="flex gap-4">
											<Button
												type="submit"
												disabled={
													updateMutation.isPending ||
													isUploadingAvatar ||
													isUploadingBanner
												}>
												{updateMutation.isPending ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Saving...
													</>
												) : (
													'Save Changes'
												)}
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => form.reset()}
												disabled={updateMutation.isPending}>
												Reset
											</Button>
										</div>
									</form>
								</Form>

								<ImageCropper
									open={cropperOpen}
									onOpenChange={setCropperOpen}
									imageSrc={cropperImg}
									onCropComplete={onCropComplete}
									aspectRatio={cropType === 'avatar' ? 1 : 4} // Banner is usually wider, like 4:1
									circularCrop={cropType === 'avatar'}
								/>
							</div>
						</TabsContent>

						<TabsContent
							value="notifications"
							className="space-y-6">
							<div className="bg-card border border-border rounded-lg p-6">
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Notification Preferences
								</h2>

								{notificationPrefsQuery.isLoading ? (
									<div className="flex items-center justify-center py-8">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : notificationPrefsQuery.isError ? (
									<div className="text-center py-8 text-muted-foreground">
										<p>Failed to load preferences.</p>
										<p className="text-sm">
											Notification preferences are only available for creators.
										</p>
									</div>
								) : (
									<div className="space-y-6">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-foreground">
													New Followers
												</p>
												<p className="text-sm text-muted-foreground">
													Get notified when someone follows you
												</p>
											</div>
											<Switch
												checked={notificationPrefs.newFollowers}
												onCheckedChange={(checked) =>
													handleNotificationChange('newFollowers', checked)
												}
												disabled={updatePreferencesMutation.isPending}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-foreground">Comments</p>
												<p className="text-sm text-muted-foreground">
													Get notified when someone comments on your videos
												</p>
											</div>
											<Switch
												checked={notificationPrefs.newComments}
												onCheckedChange={(checked) =>
													handleNotificationChange('newComments', checked)
												}
												disabled={updatePreferencesMutation.isPending}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-foreground">
													Purchase Alerts
												</p>
												<p className="text-sm text-muted-foreground">
													Get notified when someone purchases your content
												</p>
											</div>
											<Switch
												checked={notificationPrefs.purchaseAlerts}
												onCheckedChange={(checked) =>
													handleNotificationChange('purchaseAlerts', checked)
												}
												disabled={updatePreferencesMutation.isPending}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-foreground">
													Weekly Digest
												</p>
												<p className="text-sm text-muted-foreground">
													Receive a weekly summary of your activity
												</p>
											</div>
											<Switch
												checked={notificationPrefs.weeklyDigest}
												onCheckedChange={(checked) =>
													handleNotificationChange('weeklyDigest', checked)
												}
												disabled={updatePreferencesMutation.isPending}
											/>
										</div>
									</div>
								)}
							</div>
						</TabsContent>

						<TabsContent
							value="privacy"
							className="space-y-6">
							<div className="bg-card border border-border rounded-lg p-6">
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Privacy Settings
								</h2>

								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium text-foreground">
												Public Profile
											</p>
											<p className="text-sm text-muted-foreground">
												Make your profile visible to everyone
											</p>
										</div>
										<Switch
											checked={privacy.profileVisible}
											onCheckedChange={(checked) =>
												setPrivacy({ ...privacy, profileVisible: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium text-foreground">Show Email</p>
											<p className="text-sm text-muted-foreground">
												Display your email on your public profile
											</p>
										</div>
										<Switch
											checked={privacy.showEmail}
											onCheckedChange={(checked) =>
												setPrivacy({ ...privacy, showEmail: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium text-foreground">
												Allow Messages
											</p>
											<p className="text-sm text-muted-foreground">
												Let other users send you messages
											</p>
										</div>
										<Switch
											checked={privacy.allowMessages}
											onCheckedChange={(checked) =>
												setPrivacy({ ...privacy, allowMessages: checked })
											}
										/>
									</div>

									<Button>Save Settings</Button>
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="billing"
							className="space-y-6">
							<div className="bg-card border border-border rounded-lg p-6">
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Billing & Payments
								</h2>

								<div className="space-y-6">
									<div>
										<h3 className="font-semibold text-foreground mb-4">
											Payment Methods
										</h3>
										<div className="border border-border rounded-lg p-4 mb-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="w-12 h-8 bg-linear-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
														VISA
													</div>
													<div>
														<p className="font-medium text-foreground">
															•••• 4242
														</p>
														<p className="text-sm text-muted-foreground">
															Expires 12/24
														</p>
													</div>
												</div>
												<Button
													variant="outline"
													size="sm">
													Remove
												</Button>
											</div>
										</div>
										<Button variant="outline">Add Payment Method</Button>
									</div>

									<div>
										<h3 className="font-semibold text-foreground mb-4">
											Payout Settings
										</h3>
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="paypal">PayPal Email</Label>
												<Input
													id="paypal"
													type="email"
													placeholder="your@paypal.com"
												/>
											</div>
											<Button>Update Payout Method</Button>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="appearance"
							className="space-y-6">
							<div className="bg-card border border-border rounded-lg p-6">
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Appearance
								</h2>

								<div className="space-y-6">
									<div>
										<Label className="text-base font-semibold mb-4 block">
											Theme
										</Label>
										<div className="grid grid-cols-3 gap-4">
											<button className="border-2 border-primary rounded-lg p-4 bg-background">
												<div className="w-full h-20 bg-linear-to-br from-teal-900 to-teal-950 rounded mb-2"></div>
												<p className="text-sm font-medium">Dark (Current)</p>
											</button>
											<button className="border-2 border-border rounded-lg p-4 hover:border-primary">
												<div className="w-full h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
												<p className="text-sm font-medium">Light</p>
											</button>
											<button className="border-2 border-border rounded-lg p-4 hover:border-primary">
												<div className="w-full h-20 bg-linear-to-br from-teal-900 via-gray-100 to-gray-900 rounded mb-2"></div>
												<p className="text-sm font-medium">System</p>
											</button>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="language"
							className="space-y-6">
							<div className="bg-card border border-border rounded-lg p-6">
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Language & Region
								</h2>

								<div className="space-y-6">
									<div className="space-y-2">
										<Label htmlFor="language">Display Language</Label>
										<select
											id="language"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
											<option>English (US)</option>
											<option>Spanish</option>
											<option>French</option>
											<option>German</option>
											<option>Japanese</option>
										</select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="region">Region</Label>
										<select
											id="region"
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
											<option>United States</option>
											<option>United Kingdom</option>
											<option>Canada</option>
											<option>Australia</option>
										</select>
									</div>

									<Button>Save Changes</Button>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
