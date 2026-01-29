'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Video, MessageCircle, UserPlus, DollarSign, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationItemProps = {
	notification: AppNotification;
	onMarkAsRead: (id: string) => void;
	onClose?: () => void;
};

const iconMap: Record<NotificationType, typeof Bell> = {
	video_published: Video,
	comment_reply: MessageCircle,
	video_comment: MessageCircle,
	new_follower: UserPlus,
	purchase_alert: DollarSign,
	comment_liked: MessageCircle,
	system: Bell,
};

const iconColorMap: Record<NotificationType, string> = {
	video_published: 'text-blue-500 bg-blue-500/10',
	comment_reply: 'text-green-500 bg-green-500/10',
	video_comment: 'text-green-500 bg-green-500/10',
	new_follower: 'text-purple-500 bg-purple-500/10',
	purchase_alert: 'text-yellow-500 bg-yellow-500/10',
	comment_liked: 'text-pink-500 bg-pink-500/10',
	system: 'text-muted-foreground bg-muted',
};

function NotificationItemComponent({
	notification,
	onMarkAsRead,
	onClose,
}: NotificationItemProps) {
	const router = useRouter();
	const isRead = notification.isRead ?? notification.read;
	const message = notification.body ?? notification.message;
	const payload = notification.data ?? notification.payload;
	const Icon = iconMap[notification.type as NotificationType] || Bell;
	const iconColor =
		iconColorMap[notification.type as NotificationType] ||
		'text-muted-foreground bg-muted';

	const handleClick = () => {
		// Mark as read
		if (!isRead) {
			onMarkAsRead(notification._id);
		}

		// Navigate based on notification type and payload
		if (payload) {
			switch (notification.type) {
				case 'video_published':
					if (payload.movieId || payload.videoSlug) {
						router.push(`/watch/${payload.movieId || payload.videoSlug}`);
					}
					break;
				case 'comment_reply':
				case 'video_comment':
				case 'comment_liked':
					if (payload.movieId) {
						router.push(`/watch/${payload.movieId}#comments`);
					}
					break;
				case 'new_follower':
					if (payload.followerId) {
						router.push(`/channel/${payload.followerId}`);
					}
					break;
				case 'purchase_alert':
					router.push('/dashboard/sales'); // Updated to point to sales dashboard if available, or just dashboard
					break;
				default:
					break;
			}
		}

		// Close the dropdown
		onClose?.();
	};

	const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
		addSuffix: true,
	});

	return (
		<button
			onClick={handleClick}
			className={cn(
				'w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent rounded-md',
				!isRead && 'bg-primary/5',
			)}>
			<div
				className={cn(
					'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
					iconColor,
				)}>
				<Icon className="h-5 w-5" />
			</div>

			<div className="flex-1 min-w-0">
				<p
					className={cn(
						'text-sm font-medium line-clamp-1',
						!isRead ? 'text-foreground' : 'text-muted-foreground',
					)}>
					{notification.title}
				</p>
				<p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
				<p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
			</div>

			{!isRead && (
				<div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
			)}
		</button>
	);
}

export const NotificationItem = memo(NotificationItemComponent);
