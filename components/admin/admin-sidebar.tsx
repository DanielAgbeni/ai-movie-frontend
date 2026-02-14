'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	LayoutDashboard,
	Users,
	Film,
	MessageSquare,
	BarChart,
	Settings,
	LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useAuth';

const sidebarItems = [
	{
		title: 'Overview',
		href: '/admin',
		icon: LayoutDashboard,
	},
	{
		title: 'Users',
		href: '/admin/users',
		icon: Users,
	},
	{
		title: 'Movies',
		href: '/admin/movies',
		icon: Film,
	},
	{
		title: 'Comments',
		href: '/admin/comments',
		icon: MessageSquare,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();
	const { mutate: logout } = useLogout();

	return (
		<div className="flex h-screen w-64 flex-col justify-between border-r bg-card px-4 py-6">
			<div className="space-y-6">
				<div className="flex items-center gap-2 px-2">
					<span className="text-xl font-bold bg-primary bg-clip-text text-transparent">
						Admin Panel
					</span>
				</div>

				<nav className="space-y-1">
					{sidebarItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
								pathname === item.href
									? 'bg-accent text-accent-foreground'
									: 'text-muted-foreground',
							)}>
							<item.icon className="h-4 w-4" />
							{item.title}
						</Link>
					))}
				</nav>
			</div>

			<div className="space-y-1 border-t pt-4">
				<Button
					variant="ghost"
					className="w-full justify-start gap-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
					onClick={() => logout()}>
					<LogOut className="h-4 w-4" />
					Logout
				</Button>
			</div>
		</div>
	);
}
