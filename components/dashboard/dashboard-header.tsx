'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

export interface DashboardHeaderProps {
	title: string;
	subtitle: string;
}

export const DashboardHeader = memo(function DashboardHeader({
	title,
	subtitle,
}: DashboardHeaderProps) {
	return (
		<div className="mb-8 flex items-center justify-between">
			<div>
				<h1 className="mb-2 text-3xl font-bold">{title}</h1>
				<p className="text-muted-foreground">{subtitle}</p>
			</div>
			<Button
				asChild
				className="bg-primary text-primary-foreground hover:bg-primary/90">
				<Link href="/upload">
					<Video className="mr-2 h-4 w-4" />
					Upload New Video
				</Link>
			</Button>
		</div>
	);
});
