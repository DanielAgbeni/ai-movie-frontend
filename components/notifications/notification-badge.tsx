'use client';

import { cn } from '@/lib/utils';

type NotificationBadgeProps = {
	count: number;
	className?: string;
};

export function NotificationBadge({
	count,
	className,
}: NotificationBadgeProps) {
	if (count === 0) {
		return null;
	}

	const displayCount = count > 9 ? '9+' : count.toString();

	return (
		<span
			className={cn(
				'absolute -top-1 -right-1 flex items-center justify-center',
				'min-w-[18px] h-[18px] px-1 text-[10px] font-bold',
				'bg-destructive text-destructive-foreground rounded-full',
				'pointer-events-none',
				className,
			)}>
			{displayCount}
		</span>
	);
}
