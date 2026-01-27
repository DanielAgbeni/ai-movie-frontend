export interface DashboardStats {
	totalEarnings: number;
	monthlyEarnings: number;
	totalViews: number;
	subscribers: number;
	totalVideos: number;
	avgViewDuration: string;
}

export interface VideoData {
	id: string;
	title: string;
	thumbnail: string;
	views: number;
	earnings: number;
	uploadDate: string;
	status: string;
	duration: string;
}

export interface Transaction {
	id: string;
	type: 'Rental' | 'Purchase';
	video: string;
	amount: number;
	date: string;
	buyer: string;
}

export interface DemographicData {
	country: string;
	percentage: number;
}

export interface EarningSource {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	subtitle: string;
	amount: number;
}
