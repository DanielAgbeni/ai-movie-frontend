'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/header';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	ArrowLeft,
	Save,
	Trash2,
	Eye,
	Film,
	Tag,
	DollarSign,
	Loader2,
	X,
	Upload,
	ImageIcon,
} from 'lucide-react';
import {
	getCreatorMovieById,
	updateCreatorMovie,
	deleteCreatorMovie,
	getCategories,
} from '@/api/movies';
import { getCloudinarySignature } from '@/api/upload';
import Link from 'next/link';

export default function EditMoviePage() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const movieId = params.id as string;
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Form state
	const [description, setDescription] = useState('');
	const [visibility, setVisibility] = useState<
		'public' | 'unlisted' | 'private'
	>('public');
	const [type, setType] = useState<'free' | 'premium'>('free');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');
	const [rentPriceCents, setRentPriceCents] = useState(0);
	const [buyPriceCents, setBuyPriceCents] = useState(0);
	const [rentDurationHours, setRentDurationHours] = useState(48);

	// Thumbnail state
	const [thumbnail, setThumbnail] = useState<MovieImage | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
	const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

	// Fetch movie data
	const { data: movieData, isLoading: isLoadingMovie } = useQuery({
		queryKey: ['creatorMovie', movieId],
		queryFn: () => getCreatorMovieById(movieId),
		enabled: !!movieId,
	});

	// Fetch categories
	const { data: categoriesData } = useQuery({
		queryKey: ['categories'],
		queryFn: getCategories,
	});

	const movie = movieData?.data?.data?.movie;
	const categories = categoriesData?.data?.data?.categories || [];

	// Initialize form when movie data loads
	useEffect(() => {
		if (movie) {
			setDescription(movie.description || '');
			setVisibility(movie.visibility || 'public');
			setType(movie.type || 'free');
			setSelectedCategories(movie.categories || []);
			setTags(movie.tags || []);
			if (movie.thumbnail) {
				setThumbnail(movie.thumbnail);
				setThumbnailPreview(movie.thumbnail.secureUrl || movie.thumbnail.url);
			}
			if (movie.pricing) {
				setRentPriceCents(movie.pricing.rentPriceCents || 0);
				setBuyPriceCents(movie.pricing.buyPriceCents || 0);
				setRentDurationHours(movie.pricing.rentDurationHours || 48);
			}
		}
	}, [movie]);

	// Update mutation
	const updateMutation = useMutation({
		mutationFn: (data: UpdateMovieRequest) => updateCreatorMovie(movieId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['creatorMovie', movieId] });
			queryClient.invalidateQueries({ queryKey: ['creatorMovies'] });
			router.push('/dashboard');
		},
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: () => deleteCreatorMovie(movieId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['creatorMovies'] });
			router.push('/dashboard');
		},
	});

	const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && tagInput.trim()) {
			e.preventDefault();
			if (!tags.includes(tagInput.trim())) {
				setTags([...tags, tagInput.trim()]);
			}
			setTagInput('');
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleCategoryToggle = (categorySlug: string) => {
		if (selectedCategories.includes(categorySlug)) {
			setSelectedCategories(
				selectedCategories.filter((c) => c !== categorySlug),
			);
		} else {
			setSelectedCategories([...selectedCategories, categorySlug]);
		}
	};

	// Cloudinary thumbnail upload
	const handleThumbnailUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		// Show preview immediately
		const reader = new FileReader();
		reader.onload = (event) => {
			setThumbnailPreview(event.target?.result as string);
		};
		reader.readAsDataURL(file);

		setIsUploadingThumbnail(true);

		try {
			// Get Cloudinary signature
			const signatureResponse = await getCloudinarySignature({
				folder: 'ai-movies-posters',
			});
			const { signature, timestamp, cloudName, apiKey } =
				signatureResponse.data.data;

			// Upload to Cloudinary
			const formData = new FormData();
			formData.append('file', file);
			formData.append('signature', signature);
			formData.append('timestamp', timestamp.toString());
			formData.append('api_key', apiKey);
			formData.append('folder', 'ai-movies-posters');

			const uploadResponse = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				{
					method: 'POST',
					body: formData,
				},
			);

			const uploadResult = await uploadResponse.json();

			if (uploadResult.secure_url) {
				const newThumbnail: MovieImage = {
					publicId: uploadResult.public_id,
					url: uploadResult.url,
					secureUrl: uploadResult.secure_url,
				};
				setThumbnail(newThumbnail);
				setThumbnailPreview(uploadResult.secure_url);
			}
		} catch (error) {
			console.error('Thumbnail upload failed:', error);
			alert('Failed to upload thumbnail. Please try again.');
			// Reset preview if upload failed
			if (movie?.thumbnail) {
				setThumbnailPreview(movie.thumbnail.secureUrl || movie.thumbnail.url);
			} else {
				setThumbnailPreview(null);
			}
		} finally {
			setIsUploadingThumbnail(false);
		}
	};

	const handleSave = () => {
		const updateData: UpdateMovieRequest = {
			description,
			visibility,
			type,
			categories: selectedCategories,
			tags,
		};

		// Include thumbnail if changed
		if (thumbnail) {
			updateData.thumbnail = thumbnail;
		}

		if (type === 'premium') {
			updateData.pricing = {
				currency: 'USD',
				rentPriceCents,
				buyPriceCents,
				rentDurationHours,
			};
		}

		updateMutation.mutate(updateData);
	};

	if (isLoadingMovie) {
		return (
			<div className="min-h-screen">
				<Header />
				<main className="container mx-auto px-4 py-8">
					<div className="space-y-6">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-64 w-full" />
						<Skeleton className="h-48 w-full" />
					</div>
				</main>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="min-h-screen">
				<Header />
				<main className="container mx-auto px-4 py-8">
					<div className="text-center py-16">
						<h2 className="text-2xl font-bold mb-4">Movie not found</h2>
						<Button asChild>
							<Link href="/dashboard">Back to Dashboard</Link>
						</Button>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<Header />

			<main className="container mx-auto px-4 py-8">
				{/* Page Header */}
				<div className="mb-8 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							asChild>
							<Link href="/dashboard">
								<ArrowLeft className="h-5 w-5" />
							</Link>
						</Button>
						<div>
							<h1 className="text-2xl font-bold">{movie.title}</h1>
							<p className="text-muted-foreground">Edit movie details</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									disabled={deleteMutation.isPending}>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete movie?</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently delete "{movie.title}". This action
										cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => deleteMutation.mutate()}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
						<Button
							onClick={handleSave}
							disabled={updateMutation.isPending || isUploadingThumbnail}
							className="bg-primary text-primary-foreground hover:bg-primary/90">
							{updateMutation.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Save className="mr-2 h-4 w-4" />
							)}
							Save Changes
						</Button>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Thumbnail */}
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ImageIcon className="h-5 w-5" />
									Thumbnail
								</CardTitle>
								<CardDescription>
									Click to upload a new thumbnail image
								</CardDescription>
							</CardHeader>
							<CardContent>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleThumbnailUpload}
									className="hidden"
								/>
								<div
									onClick={() => fileInputRef.current?.click()}
									className="relative aspect-video overflow-hidden rounded-lg bg-muted cursor-pointer group border-2 border-dashed border-border hover:border-primary transition-colors">
									{thumbnailPreview ? (
										<>
											<img
												src={thumbnailPreview}
												alt={movie.title}
												className="h-full w-full object-cover"
											/>
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												{isUploadingThumbnail ? (
													<Loader2 className="h-8 w-8 text-white animate-spin" />
												) : (
													<div className="text-center text-white">
														<Upload className="h-8 w-8 mx-auto mb-2" />
														<p>Click to change thumbnail</p>
													</div>
												)}
											</div>
										</>
									) : (
										<div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
											{isUploadingThumbnail ? (
												<Loader2 className="h-8 w-8 animate-spin" />
											) : (
												<>
													<Upload className="h-8 w-8" />
													<p>Click to upload thumbnail</p>
												</>
											)}
										</div>
									)}
								</div>
								{movie.full?.processingStatus && (
									<div className="mt-2 flex items-center gap-2">
										<span className="text-sm text-muted-foreground">
											Video Status:
										</span>
										<Badge
											variant={
												movie.full.processingStatus === 'ready'
													? 'default'
													: 'secondary'
											}>
											{movie.full.processingStatus}
										</Badge>
									</div>
								)}
								{movie.durationSec && (
									<p className="mt-2 text-sm text-muted-foreground">
										Duration: {Math.floor(movie.durationSec / 60)}:
										{String(movie.durationSec % 60).padStart(2, '0')}
									</p>
								)}
							</CardContent>
						</Card>

						{/* Description */}
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle>Description</CardTitle>
								<CardDescription>
									Update the description for your movie
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Enter movie description..."
									className="min-h-[150px]"
								/>
							</CardContent>
						</Card>

						{/* Tags */}
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Tag className="h-5 w-5" />
									Tags
								</CardTitle>
								<CardDescription>
									Add tags to help viewers find your content
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Input
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyDown={handleAddTag}
										placeholder="Type a tag and press Enter..."
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									{tags.length === 0 ? (
										<p className="text-sm text-muted-foreground">
											No tags added yet
										</p>
									) : (
										tags.map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="gap-1">
												{tag}
												<button
													onClick={() => handleRemoveTag(tag)}
													className="ml-1 hover:text-destructive">
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Visibility */}
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Eye className="h-5 w-5" />
									Visibility
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Select
									value={visibility}
									onValueChange={(v: 'public' | 'unlisted' | 'private') =>
										setVisibility(v)
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="public">Public</SelectItem>
										<SelectItem value="unlisted">Unlisted</SelectItem>
										<SelectItem value="private">Private</SelectItem>
									</SelectContent>
								</Select>
							</CardContent>
						</Card>

						{/* Categories */}
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle>Categories</CardTitle>
								<CardDescription>
									Select categories for your movie
								</CardDescription>
							</CardHeader>
							<CardContent>
								{categories.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										Loading categories...
									</p>
								) : (
									<div className="flex flex-wrap gap-2">
										{categories.map((category) => (
											<Badge
												key={category._id}
												variant={
													selectedCategories.includes(category.slug)
														? 'default'
														: 'outline'
												}
												className="cursor-pointer transition-colors hover:bg-primary/20"
												onClick={() => handleCategoryToggle(category.slug)}>
												{category.name}
											</Badge>
										))}
									</div>
								)}
								{selectedCategories.length > 0 && (
									<p className="mt-3 text-xs text-muted-foreground">
										Selected: {selectedCategories.join(', ')}
									</p>
								)}
							</CardContent>
						</Card>

						{/* Pricing */}
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<DollarSign className="h-5 w-5" />
									Pricing
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label>Content Type</Label>
									<Select
										value={type}
										onValueChange={(v: 'free' | 'premium') => setType(v)}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="free">Free</SelectItem>
											<SelectItem value="premium">Premium</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{type === 'premium' && (
									<>
										<div>
											<Label>Rent Price (cents)</Label>
											<Input
												type="number"
												value={rentPriceCents}
												onChange={(e) =>
													setRentPriceCents(Number(e.target.value))
												}
												placeholder="e.g. 399 for $3.99"
											/>
											<p className="mt-1 text-xs text-muted-foreground">
												${(rentPriceCents / 100).toFixed(2)}
											</p>
										</div>
										<div>
											<Label>Buy Price (cents)</Label>
											<Input
												type="number"
												value={buyPriceCents}
												onChange={(e) =>
													setBuyPriceCents(Number(e.target.value))
												}
												placeholder="e.g. 1299 for $12.99"
											/>
											<p className="mt-1 text-xs text-muted-foreground">
												${(buyPriceCents / 100).toFixed(2)}
											</p>
										</div>
										<div>
											<Label>Rent Duration (hours)</Label>
											<Input
												type="number"
												value={rentDurationHours}
												onChange={(e) =>
													setRentDurationHours(Number(e.target.value))
												}
												placeholder="e.g. 48"
											/>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Movie Info */}
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle>Movie Info</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Created</span>
									<span>{new Date(movie.createdAt).toLocaleDateString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Updated</span>
									<span>{new Date(movie.updatedAt).toLocaleDateString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Views</span>
									<span>{movie.stats?.viewsCount?.toLocaleString() || 0}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Likes</span>
									<span>{movie.stats?.likesCount?.toLocaleString() || 0}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Comments</span>
									<span>
										{movie.stats?.commentsCount?.toLocaleString() || 0}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
