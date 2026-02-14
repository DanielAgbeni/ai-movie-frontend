'use client';

import { AdminGuard } from '@/components/admin/admin-guard';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AdminGuard>
			<div className="flex h-screen bg-background">
				<AdminSidebar />
				<main className="flex-1 overflow-y-auto p-8">{children}</main>
			</div>
		</AdminGuard>
	);
}
