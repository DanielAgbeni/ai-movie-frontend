'use client';

import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from './notification-item';
import {
	useNotifications,
	useMarkAsRead,
	useMarkAllAsRead,
} from '@/hooks/useNotifications';
import { useUnreadCount } from '@/store/useNotificationStore';

type NotificationListProps = {
	onClose?: () => void;
};

export function NotificationList({ onClose }: NotificationListProps) {
	const unreadCount = useUnreadCount();
	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useNotifications();

	const markAsRead = useMarkAsRead();
	const markAllAsRead = useMarkAllAsRead();

	const allNotifications =
		data?.pages.flatMap((page) => page.notifications) ?? [];

	const handleMarkAsRead = (id: string) => {
		markAsRead.mutate(id);
	};

	const handleMarkAllAsRead = () => {
		markAllAsRead.mutate();
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Bell className="h-8 w-8 text-muted-foreground mb-2" />
				<p className="text-sm text-muted-foreground">
					Failed to load notifications
				</p>
			</div>
		);
	}

	if (allNotifications.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Bell className="h-8 w-8 text-muted-foreground mb-2" />
				<p className="text-sm text-muted-foreground">No notifications yet</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-3 border-b">
				<div>
					<h3 className="font-semibold text-sm">Notifications</h3>
					{unreadCount > 0 && (
						<p className="text-xs text-muted-foreground">
							{unreadCount} unread
						</p>
					)}
				</div>
				{unreadCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleMarkAllAsRead}
						disabled={markAllAsRead.isPending}
						className="text-xs h-7">
						<CheckCheck className="h-3.5 w-3.5 mr-1" />
						Mark all read
					</Button>
				)}
			</div>

			{/* Notification List */}
			<ScrollArea className="h-[400px]">
				<div className="p-2 space-y-1">
					{allNotifications.map((notification) => (
						<NotificationItem
							key={notification._id}
							notification={notification}
							onMarkAsRead={handleMarkAsRead}
							onClose={onClose}
						/>
					))}

					{/* Load More */}
					{hasNextPage && (
						<div className="pt-2">
							<Button
								variant="ghost"
								size="sm"
								className="w-full text-xs"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}>
								{isFetchingNextPage ? (
									<>
										<Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
										Loading...
									</>
								) : (
									'Load more'
								)}
							</Button>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
