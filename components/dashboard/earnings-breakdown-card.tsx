'use client';

import { memo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Video, Download, Eye, LucideIcon } from 'lucide-react';

export interface EarningSource {
	icon: LucideIcon;
	title: string;
	subtitle: string;
	amount: number;
}

export interface EarningsBreakdownCardProps {
	sources?: EarningSource[];
	title?: string;
	description?: string;
}

const defaultSources: EarningSource[] = [
	{
		icon: Video,
		title: 'Video Rentals',
		subtitle: '342 transactions',
		amount: 4532.89,
	},
	{
		icon: Download,
		title: 'Video Purchases',
		subtitle: '156 transactions',
		amount: 6342.12,
	},
	{
		icon: Eye,
		title: 'Ad Revenue',
		subtitle: '12.5M impressions',
		amount: 1668.66,
	},
];

const EarningSourceItem = memo(function EarningSourceItem({
	source,
}: {
	source: EarningSource;
}) {
	const Icon = source.icon;
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
					<Icon className="h-5 w-5 text-primary" />
				</div>
				<div>
					<p className="font-semibold">{source.title}</p>
					<p className="text-sm text-muted-foreground">{source.subtitle}</p>
				</div>
			</div>
			<span className="text-lg font-bold text-primary">
				${source.amount.toLocaleString()}
			</span>
		</div>
	);
});

export const EarningsBreakdownCard = memo(function EarningsBreakdownCard({
	sources = defaultSources,
	title = 'Earnings Breakdown',
	description = 'Your revenue sources',
}: EarningsBreakdownCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{sources.map((source, index) => (
						<EarningSourceItem
							key={index}
							source={source}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
});
