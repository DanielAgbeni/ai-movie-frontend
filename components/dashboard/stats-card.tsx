'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
	title: string;
	value: string;
	subtitle: string;
	icon: LucideIcon;
}

export const StatsCard = memo(function StatsCard({
	title,
	value,
	subtitle,
	icon: Icon,
}: StatsCardProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="h-4 w-4 text-primary" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{subtitle}</p>
			</CardContent>
		</Card>
	);
});
