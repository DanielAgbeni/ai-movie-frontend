'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationBadge } from './notification-badge';
import { NotificationList } from './notification-list';
import { useUnreadCount } from '@/store/useNotificationStore';

export function NotificationDropdown() {
	const [open, setOpen] = useState(false);
	const unreadCount = useUnreadCount();

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative text-foreground hover:text-primary hover:bg-primary/10"
					aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}>
					<Bell className="h-5 w-5" />
					<NotificationBadge count={unreadCount} />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="w-[380px] p-0"
				sideOffset={8}>
				<NotificationList onClose={() => setOpen(false)} />
			</PopoverContent>
		</Popover>
	);
}
