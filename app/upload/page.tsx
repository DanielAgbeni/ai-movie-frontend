'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/header';
import { AccessDenied } from '@/components/access-denied';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from '@/components/ui/form';
import {
	Upload,
	Film,
	DollarSign,
	X,
	CheckCircle2,
	Image as ImageIcon,
	Loader2,
	XCircle,
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCloudinarySignature, getMuxUploadUrl } from '@/api/upload';
import { createMovie, getMovieById } from '@/api/movies';
import { useUser, useIsAuthenticated } from '@/store/useAuthStore';
import axios from 'axios';
import { ImageCropper } from '@/components/ui/image-cropper';
import { toast } from 'sonner';

// Define the schema
const uploadSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		description: z.string().optional(),
		category: z.string().min(1, 'Category is required'),
		visibility: z.enum(['public', 'unlisted', 'private']),
		monetizationEnabled: z.boolean().default(false),
		rentPrice: z.string().optional(),
		buyPrice: z.string().optional(),
		tags: z.array(z.string()).default([]),
	})
	.refine(
		(data) => {
			if (data.monetizationEnabled) {
				const rent = parseFloat(data.rentPrice || '0');
				const buy = parseFloat(data.buyPrice || '0');
				return rent > 0 && buy > 0;
			}
			return true;
		},
		{
			message: 'Prices must be greater than 0 when monetization is enabled',
			path: ['rentPrice'], // Associate error with rentPrice
		},
	);

type UploadFormValues = z.infer<typeof uploadSchema>;

function UploadPage() {
	const router = useRouter();
	const user = useUser();
	const isAuthenticated = useIsAuthenticated();
	const [showAccessDenied, setShowAccessDenied] = useState(false);

	// Form HOC
	const form = useForm<UploadFormValues>({
		resolver: zodResolver(uploadSchema),
		defaultValues: {
			title: '',
			description: '',
			category: '',
			visibility: 'public',
			monetizationEnabled: false,
			rentPrice: '',
			buyPrice: '',
			tags: [],
		},
	});

	// Tag input state (separate from RHF)
	const [tagInput, setTagInput] = useState('');

	useEffect(() => {
		if (!isAuthenticated) {
			router.push('/login');
			return;
		}
		if (user && user.role !== 'admin' && user.role !== 'creator') {
			setShowAccessDenied(true);
		}
	}, [isAuthenticated, user, router]);

	// File States
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [posterFile, setPosterFile] = useState<File | null>(null);

	// Upload States
	const [videoProgress, setVideoProgress] = useState(0);
	const [isUploadingVideo, setIsUploadingVideo] = useState(false);
	const [videoUploadId, setVideoUploadId] = useState<string | null>(null);

	const [posterProgress, setPosterProgress] = useState(0);
	const [isUploadingPoster, setIsUploadingPoster] = useState(false);
	const [posterData, setPosterData] = useState<{
		publicId: string;
		url: string;
		secureUrl: string;
	} | null>(null);

	// Cropper State
	const [cropperOpen, setCropperOpen] = useState(false);
	const [cropperImg, setCropperImg] = useState<string | null>(null);

	// Created movie state for polling
	const [createdMovieId, setCreatedMovieId] = useState<string | null>(null);
	const [language, setLanguage] = useState('en');

	// Object URLs
	const videoPreviewUrl = useMemo(() => {
		if (!videoFile) return null;
		return URL.createObjectURL(videoFile);
	}, [videoFile]);

	const posterPreviewUrl = useMemo(() => {
		if (!posterFile) return null;
		return URL.createObjectURL(posterFile);
	}, [posterFile]);

	useEffect(() => {
		return () => {
			if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
		};
	}, [videoPreviewUrl]);

	useEffect(() => {
		return () => {
			if (posterPreviewUrl) URL.revokeObjectURL(posterPreviewUrl);
		};
	}, [posterPreviewUrl]);

	const refetchInterval = useCallback((query: any) => {
		const movie = query.state.data?.data?.data?.movie;
		const status = movie?.full?.processingStatus;

		if (status === 'ready' || status === 'errored') {
			return false;
		}

		return 3000;
	}, []);

	const { data: createdMovie } = useQuery({
		queryKey: ['movie', createdMovieId] as const,
		queryFn: () => getMovieById(createdMovieId!),
		enabled: !!createdMovieId,
		refetchInterval,
	});

	const movieData = createdMovie?.data?.data?.movie;

	const isVideoProcessing = useMemo(
		() =>
			!!createdMovieId &&
			(movieData?.full?.processingStatus === 'pending' ||
				movieData?.full?.processingStatus === 'processing'),
		[createdMovieId, movieData?.full?.processingStatus],
	);

	const isVideoReady = useMemo(
		() => movieData?.full?.processingStatus === 'ready',
		[movieData?.full?.processingStatus],
	);

	const isVideoErrored = useMemo(
		() => movieData?.full?.processingStatus === 'errored',
		[movieData?.full?.processingStatus],
	);

	const createMovieMutation = useMutation({
		mutationFn: (data: CreateMovieRequest) => createMovie(data),
		onSuccess: (response) => {
			const movie = response.data.data.movie;
			setCreatedMovieId(movie._id);
			toast.success('Movie Created!', {
				description: movie.full?.processingStatus
					? 'Video is being processed. You can wait or visit the movie page.'
					: `Movie "${movie.title}" created successfully!`,
			});
		},
		onError: (error: any) => {
			toast.error('Error', {
				description: error.response?.data?.message || 'Failed to create movie',
			});
		},
	});

	const handleVideoSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			setVideoFile(file);
			setVideoUploadId(null);
			setVideoProgress(0);
		},
		[],
	);

	const handlePosterSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			if (!file.type.startsWith('image/')) {
				toast.error('Invalid File', {
					description: 'Please select an image file.',
				});
				return;
			}

			// Open Cropper
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setCropperImg(reader.result as string);
				setCropperOpen(true);
			});
			reader.readAsDataURL(file);
			e.target.value = ''; // Reset input
		},
		[],
	);

	const onCropComplete = useCallback((croppedBlob: Blob) => {
		const file = new File([croppedBlob], 'poster.jpg', { type: 'image/jpeg' });
		setPosterFile(file);
		setPosterData(null);
		setPosterProgress(0);
	}, []);

	const clearVideo = useCallback(() => {
		setVideoFile(null);
		setVideoUploadId(null);
		setVideoProgress(0);
	}, []);

	const clearPoster = useCallback(() => {
		setPosterFile(null);
		setPosterData(null);
		setPosterProgress(0);
	}, []);

	const uploadPoster = useCallback(async () => {
		if (!posterFile) return;
		setIsUploadingPoster(true);

		try {
			const { data } = await getCloudinarySignature({
				folder: 'ai-movies-posters',
			});
			const { signature, timestamp, cloudName, apiKey } = data.data;

			const formData = new FormData();
			formData.append('file', posterFile);
			formData.append('api_key', apiKey);
			formData.append('timestamp', timestamp.toString());
			formData.append('signature', signature);
			formData.append('folder', 'ai-movies-posters');

			const res = await axios.post(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				formData,
				{
					onUploadProgress: (progressEvent) => {
						const total = progressEvent.total || 1;
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / total,
						);
						setPosterProgress(percentCompleted);
					},
				},
			);

			setPosterData({
				publicId: res.data.public_id,
				url: res.data.url,
				secureUrl: res.data.secure_url,
			});

			toast.success('Poster Uploaded', {
				description: 'Image processed successfully',
			});
		} catch (error) {
			console.error('Poster upload failed', error);
			toast.error('Upload Failed', {
				description: 'Failed to upload poster',
			});
		} finally {
			setIsUploadingPoster(false);
		}
	}, [posterFile]);

	const uploadVideo = useCallback(async () => {
		if (!videoFile) return;
		setIsUploadingVideo(true);

		try {
			const { data } = await getMuxUploadUrl({ cors_origin: '*' });
			const { uploadUrl, uploadId } = data.data;

			await axios.put(uploadUrl, videoFile, {
				headers: { 'Content-Type': videoFile.type },
				onUploadProgress: (progressEvent) => {
					const total = progressEvent.total || 1;
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / total,
					);
					setVideoProgress(percentCompleted);
				},
			});

			setVideoUploadId(uploadId);
			toast.success('Video Uploaded', {
				description: 'Video sent to processing queue',
			});
		} catch (error) {
			console.error('Video upload failed', error);
			toast.error('Upload Failed', {
				description: 'Failed to upload video',
			});
		} finally {
			setIsUploadingVideo(false);
		}
	}, [videoFile]);

	const addTag = useCallback(() => {
		const t = tagInput.trim();
		if (!t) return;

		const currentTags = form.getValues('tags');
		if (!currentTags.includes(t)) {
			form.setValue('tags', [...currentTags, t]);
		}
		setTagInput('');
	}, [tagInput, form]);

	const removeTag = useCallback(
		(tagToRemove: string) => {
			const currentTags = form.getValues('tags');
			form.setValue(
				'tags',
				currentTags.filter((t) => t !== tagToRemove),
			);
		},
		[form],
	);

	const handleTagKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key !== 'Enter') return;
			e.preventDefault();
			addTag();
		},
		[addTag],
	);

	const onSubmit = (data: UploadFormValues) => {
		if (!videoUploadId) {
			toast.error('Required', {
				description: 'Please upload a video first',
			});
			return;
		}

		const requestData: CreateMovieRequest = {
			title: data.title.trim(),
			description: data.description?.trim(),
			visibility: data.visibility,
			categories: [data.category],
			tags: [...data.tags, `lang:${language}`],
			type: data.monetizationEnabled ? 'premium' : 'free',
			full: {
				uploadId: videoUploadId,
				assetId: videoUploadId,
				playbackId: videoUploadId,
			},
			...(posterData && {
				thumbnail: posterData,
			}),
			...(data.monetizationEnabled && {
				pricing: {
					currency: 'USD',
					rentPriceCents: Math.round(parseFloat(data.rentPrice || '0') * 100),
					buyPriceCents: Math.round(parseFloat(data.buyPrice || '0') * 100),
					rentDurationHours: 48,
				},
			}),
		};

		createMovieMutation.mutate(requestData);
	};

	const goToMovie = useCallback(() => {
		if (!createdMovieId) return;
		router.push(`/watch/${createdMovieId}`);
	}, [router, createdMovieId]);

	if (showAccessDenied) {
		return (
			<div className="min-h-screen">
				<Header />
				<AccessDenied
					title="Creator Access Required"
					description="You need to be a creator to upload and monetize your AI-generated movies. Set up your creator profile to get started."
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<Header />

			<main className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-4xl">
					<div className="mb-8">
						<h1 className="mb-2 text-3xl font-bold">Upload Your AI Movie</h1>
						<p className="text-muted-foreground">
							Share your AI-generated content with the world. Set your own
							pricing and earn from your creativity.
						</p>
					</div>

					<div className="space-y-6">
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle>Video File</CardTitle>
								<CardDescription>
									Upload your AI-generated movie file
								</CardDescription>
							</CardHeader>
							<CardContent>
								{!videoFile ? (
									<div className="flex flex-col items-center gap-4">
										<Label
											htmlFor="video-upload"
											className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-12 transition-colors hover:border-primary/50 hover:bg-secondary w-full">
											<Upload className="mb-4 h-12 w-12 text-muted-foreground" />
											<p className="mb-2 text-sm font-semibold">
												Select Video File
											</p>
											<p className="text-xs text-muted-foreground">
												MP4, MOV, AVI (Max 10GB)
											</p>
										</Label>
										<Input
											id="video-upload"
											type="file"
											className="hidden"
											accept="video/*"
											onChange={handleVideoSelect}
										/>
									</div>
								) : (
									<div className="space-y-4">
										<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/50">
											<video
												src={videoPreviewUrl ?? undefined}
												className="h-full w-full object-contain"
												controls
											/>
										</div>

										<div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4">
											<Film className="h-10 w-10 text-primary" />
											<div className="flex-1 overflow-hidden">
												<p className="font-semibold truncate">
													{videoFile.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{(videoFile.size / (1024 * 1024)).toFixed(2)} MB
												</p>
											</div>
											<Button
												variant="ghost"
												size="icon"
												onClick={clearVideo}>
												<X className="h-4 w-4" />
											</Button>
										</div>

										{!videoUploadId && !isUploadingVideo && (
											<Button
												onClick={uploadVideo}
												disabled={isUploadingVideo}
												className="w-full">
												Start Upload
											</Button>
										)}

										{(isUploadingVideo || videoUploadId) && (
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>
														{isUploadingVideo
															? 'Uploading...'
															: 'Upload Complete'}
													</span>
													<span>{videoProgress}%</span>
												</div>
												<Progress value={videoProgress} />
											</div>
										)}
									</div>
								)}
							</CardContent>
						</Card>

						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle>Poster / Thumbnail (Optional)</CardTitle>
								<CardDescription>
									Upload an engaging cover image (16:9)
								</CardDescription>
							</CardHeader>
							<CardContent>
								{!posterFile ? (
									<div className="flex flex-col items-center gap-4">
										<Label
											htmlFor="poster-upload"
											className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-8 transition-colors hover:border-primary/50 hover:bg-secondary w-full">
											<ImageIcon className="mb-4 h-10 w-10 text-muted-foreground" />
											<p className="mb-2 text-sm font-semibold">
												Select Image File
											</p>
										</Label>
										<Input
											id="poster-upload"
											type="file"
											className="hidden"
											accept="image/*"
											onChange={handlePosterSelect}
										/>
									</div>
								) : (
									<div className="space-y-4">
										{/* Changed preview to 16/9 aspect ratio */}
										<div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg border border-border bg-secondary/50">
											<img
												src={posterPreviewUrl ?? undefined}
												alt="Preview"
												className="h-full w-full object-cover"
											/>
										</div>

										<div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4">
											<ImageIcon className="h-10 w-10 text-primary" />
											<div className="flex-1 overflow-hidden">
												<p className="font-semibold truncate">
													{posterFile.name}
												</p>
											</div>
											<Button
												variant="ghost"
												size="icon"
												onClick={clearPoster}>
												<X className="h-4 w-4" />
											</Button>
										</div>

										{!posterData && !isUploadingPoster && (
											<Button
												onClick={uploadPoster}
												disabled={isUploadingPoster}
												variant="secondary"
												className="w-full">
												Upload Poster
											</Button>
										)}

										{(isUploadingPoster || posterData) && (
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>
														{isUploadingPoster
															? 'Uploading...'
															: 'Upload Complete'}
													</span>
													<span>{posterProgress}%</span>
												</div>
												<Progress value={posterProgress} />
											</div>
										)}
									</div>
								)}
							</CardContent>
						</Card>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6">
								<Card className="border-border bg-card">
									<CardHeader>
										<CardTitle>Details</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title *</FormLabel>
													<FormControl>
														<Input
															placeholder="Movie Title"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (Optional)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Description..."
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid gap-6 md:grid-cols-2">
											<FormField
												control={form.control}
												name="category"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Category *</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select Category" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="sci-fi">Sci-Fi</SelectItem>
																<SelectItem value="fantasy">Fantasy</SelectItem>
																<SelectItem value="action">Action</SelectItem>
																<SelectItem value="drama">Drama</SelectItem>
																<SelectItem value="comedy">Comedy</SelectItem>
																<SelectItem value="horror">Horror</SelectItem>
																<SelectItem value="documentary">
																	Documentary
																</SelectItem>
																<SelectItem value="experimental">
																	Experimental
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="visibility"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Visibility</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="public">Public</SelectItem>
																<SelectItem value="unlisted">
																	Unlisted
																</SelectItem>
																<SelectItem value="private">Private</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormItem>
											<FormLabel>Tags</FormLabel>
											<div className="flex gap-2">
												<FormControl>
													<Input
														value={tagInput}
														onChange={(e) => setTagInput(e.target.value)}
														placeholder="Add tag and press Enter"
														onKeyDown={handleTagKeyDown}
													/>
												</FormControl>
												<Button
													type="button"
													onClick={addTag}
													variant="secondary">
													Add
												</Button>
											</div>
											<div className="flex flex-wrap gap-2 mt-2">
												{form.watch('tags').map((tag) => (
													<Badge
														key={tag}
														variant="secondary">
														{tag}{' '}
														<X
															className="ml-1 h-3 w-3 cursor-pointer"
															onClick={() => removeTag(tag)}
														/>
													</Badge>
												))}
											</div>
											<FormMessage />
										</FormItem>
									</CardContent>
								</Card>

								<Card className="border-border bg-card">
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="flex items-center gap-2">
												<DollarSign className="h-5 w-5" /> Monetization
											</CardTitle>
											<FormField
												control={form.control}
												name="monetizationEnabled"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Switch
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
									</CardHeader>

									{form.watch('monetizationEnabled') && (
										<CardContent className="grid gap-6 md:grid-cols-2">
											<FormField
												control={form.control}
												name="rentPrice"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Rental Price ($)</FormLabel>
														<FormControl>
															<Input
																type="number"
																placeholder="2.99"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="buyPrice"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Purchase Price ($)</FormLabel>
														<FormControl>
															<Input
																type="number"
																placeholder="9.99"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</CardContent>
									)}
								</Card>

								<div className="flex gap-4">
									<Button
										size="lg"
										className="flex-1"
										type="submit"
										disabled={
											createMovieMutation.isPending ||
											!!createdMovieId ||
											!videoUploadId
										}>
										{createMovieMutation.isPending ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Creating Movie...
											</>
										) : createdMovieId ? (
											<>
												<CheckCircle2 className="mr-2 h-4 w-4" />
												Movie Created
											</>
										) : (
											<>
												<CheckCircle2 className="mr-2 h-4 w-4" />
												Publish Movie
											</>
										)}
									</Button>
								</div>
							</form>
						</Form>

						{createdMovieId && (
							<Card className="border-primary/50 bg-primary/5">
								<CardContent className="pt-6">
									<div className="flex items-center gap-4">
										{isVideoProcessing ? (
											<>
												<Loader2 className="h-8 w-8 animate-spin text-primary" />
												<div>
													<h4 className="font-semibold">Processing Video...</h4>
													<p className="text-sm text-muted-foreground">
														Your video is being optimized. This may take a few
														minutes.
													</p>
												</div>
											</>
										) : isVideoReady ? (
											<>
												<CheckCircle2 className="h-8 w-8 text-green-500" />
												<div className="flex-1">
													<h4 className="font-semibold text-green-600">
														Video Ready!
													</h4>
													<p className="text-sm text-muted-foreground">
														Your movie is now live and ready to watch.
													</p>
												</div>
												<Button onClick={goToMovie}>View Movie</Button>
											</>
										) : isVideoErrored ? (
											<>
												<XCircle className="h-8 w-8 text-red-500" />
												<div className="flex-1">
													<h4 className="font-semibold text-red-600">
														Processing Failed
													</h4>
													<p className="text-sm text-muted-foreground">
														There was an error processing your video. Please try
														again.
													</p>
												</div>
											</>
										) : (
											<>
												<Film className="h-8 w-8 text-primary" />
												<div className="flex-1">
													<h4 className="font-semibold">Movie Created</h4>
													<p className="text-sm text-muted-foreground">
														Your movie has been saved.
													</p>
												</div>
												<Button onClick={goToMovie}>View Movie</Button>
											</>
										)}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>

			<ImageCropper
				open={cropperOpen}
				onOpenChange={setCropperOpen}
				imageSrc={cropperImg}
				onCropComplete={onCropComplete}
				aspectRatio={16 / 9}
			/>
		</div>
	);
}

export default memo(UploadPage);
