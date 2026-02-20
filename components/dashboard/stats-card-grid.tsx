'use client';

import { memo } from 'react';
import { DollarSign, Eye, Users, Video } from 'lucide-react';
import { StatsCard } from './stats-card';
import type { DashboardStats } from './types';

export interface StatsCardGridProps {
	stats: DashboardStats;
}

export const StatsCardGrid = memo(function StatsCardGrid({
	stats,
}: StatsCardGridProps) {
	return (
		<div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<StatsCard
				title="Total Earnings"
				value={`$${stats.totalEarnings.toLocaleString()}`}
				subtitle={`+$${stats.monthlyEarnings.toFixed(2)} this month`}
				icon={DollarSign}
			/>
			<StatsCard
				title="Total Views"
				value={`${stats.totalViews}`}
				subtitle="Across all videos"
				icon={Eye}
			/>
			<StatsCard
				title="Subscribers"
				value={`${stats.subscribers}`}
				subtitle="Total subscribers"
				icon={Users}
			/>
			<StatsCard
				title="Total Videos"
				value={stats.totalVideos.toString()}
				subtitle="Published content"
				icon={Video}
			/>
		</div>
	);
});
