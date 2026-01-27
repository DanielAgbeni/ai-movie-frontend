import { VideoCardProps } from '@/components/video-card';
import '@/api/types'; // Ensure global types are loaded

export const mapMovieToVideoCard = (movie: Movie): VideoCardProps => ({
	id: movie._id,
	title: movie.title,
	thumbnail: movie.thumbnail?.url || movie.poster?.url || '/placeholder.svg',
	creator: {
		name: movie.creatorId?.displayName || 'Unknown Creator',
		avatar: movie.creatorId?.avatarUrl || '/diverse-avatars.png',
	},
	views: formatNumber(movie.stats.viewsCount),
	uploadDate: new Date(
		movie.publishedAt || movie.createdAt,
	).toLocaleDateString(),
	duration: formatDuration(movie.durationSec),
	price: {
		rent:
			movie.pricing.rentPriceCents > 0
				? movie.pricing.rentPriceCents / 100
				: undefined,
		buy:
			movie.pricing.buyPriceCents > 0
				? movie.pricing.buyPriceCents / 100
				: undefined,
	},
	isPremium: movie.type === 'premium',
});

export const formatNumber = (num: number) => {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	return num.toString();
};

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
