'use client';

import { memo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export interface WatchTimeStats {
	avgDuration: string;
	completionRate: number;
	avgWatchTime: string;
	engagementRate: number;
}

export interface WatchTimeCardProps {
	stats?: WatchTimeStats;
	title?: string;
	description?: string;
}

const defaultStats: WatchTimeStats = {
	avgDuration: '18:32',
	completionRate: 78,
	avgWatchTime: '18:32',
	engagementRate: 12.4,
};

const StatRow = memo(function StatRow({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<div className="flex justify-between text-sm">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-medium">{value}</span>
		</div>
	);
});

export const WatchTimeCard = memo(function WatchTimeCard({
	stats = defaultStats,
	title = 'Watch Time',
	description = 'Average viewing duration',
}: WatchTimeCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-6 text-4xl font-bold">{stats.avgDuration}</div>
				<div className="space-y-3">
					<StatRow
						label="Completion Rate"
						value={`${stats.completionRate}%`}
					/>
					<StatRow
						label="Avg. Watch Time"
						value={stats.avgWatchTime}
					/>
					<StatRow
						label="Engagement Rate"
						value={`${stats.engagementRate}%`}
					/>
				</div>
			</CardContent>
		</Card>
	);
});
