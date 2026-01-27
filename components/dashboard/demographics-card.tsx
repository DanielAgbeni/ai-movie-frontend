'use client';

import { memo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export interface DemographicItem {
	country: string;
	percentage: number;
}

export interface DemographicsCardProps {
	demographics?: DemographicItem[];
	title?: string;
	description?: string;
}

const defaultDemographics: DemographicItem[] = [
	{ country: 'United States', percentage: 45 },
	{ country: 'United Kingdom', percentage: 22 },
	{ country: 'Canada', percentage: 15 },
];

const DemographicRow = memo(function DemographicRow({
	item,
}: {
	item: DemographicItem;
}) {
	// Convert percentage to approximate width class
	const widthPercent = Math.min(100, Math.max(0, item.percentage * 2));

	return (
		<div className="flex items-center justify-between">
			<span className="text-sm">{item.country}</span>
			<div className="flex items-center gap-2">
				<div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
					<div
						className="h-full bg-primary"
						style={{ width: `${widthPercent}%` }}
					/>
				</div>
				<span className="text-sm font-medium">{item.percentage}%</span>
			</div>
		</div>
	);
});

export const DemographicsCard = memo(function DemographicsCard({
	demographics = defaultDemographics,
	title = 'Audience Demographics',
	description = 'Where your viewers are from',
}: DemographicsCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{demographics.map((item, index) => (
						<DemographicRow
							key={index}
							item={item}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
});
