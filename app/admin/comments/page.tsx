'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminComments } from '@/api/admin';
import { CommentsTable } from '@/components/admin/comments-table';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CommentsPage() {
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	const [status, setStatus] = useState<'all' | 'active' | 'deleted'>('all');

	const { data, isLoading, error } = useQuery({
		queryKey: ['admin-comments', cursor, status],
		queryFn: () => getAdminComments(cursor, 20, status),
	});

	if (error) return <div>Error loading comments</div>;

	// Fix: The JSON data shows the array is directly under `data` and meta is sibling to it.
	// response.data = { success: true, message: "...", data: [...], meta: {...} }
	// So data.data.data is the array.
	const responseData = data?.data;
	// @ts-ignore - The ApiResponse type might need adjustment if generic T is strictly validated, currently T is the data field type.
	const commentList = Array.isArray(responseData?.data)
		? responseData?.data
		: [];
	const meta: any = responseData?.meta?.pagination || {};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Comments</h1>
			</div>

			<Tabs
				defaultValue="all"
				value={status}
				onValueChange={(val: any) => {
					setStatus(val);
					setCursor(undefined);
				}}>
				<TabsList>
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="active">Active</TabsTrigger>
					<TabsTrigger value="deleted">Taken Down</TabsTrigger>
				</TabsList>
			</Tabs>

			{isLoading ? (
				<div className="flex h-32 items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : (
				<CommentsTable
					comments={commentList}
					pagination={meta}
					isLoading={isLoading}
				/>
			)}

			<div className="flex justify-end gap-2">
				<Button
					variant="outline"
					disabled={!cursor}
					onClick={() => setCursor(undefined)}>
					Reset / First Page
				</Button>
				<Button
					variant="outline"
					disabled={!meta?.hasMore}
					onClick={() => setCursor(meta?.nextCursor)}>
					Next
				</Button>
			</div>
		</div>
	);
}
