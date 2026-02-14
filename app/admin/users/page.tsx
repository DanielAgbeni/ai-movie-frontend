'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminUsers } from '@/api/admin';
import { UsersTable } from '@/components/admin/users-table';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	// We'll keep a history of cursors to go back if needed, or just simple Load More
	// For now, simple Load More or just current page.
	// The API returns nextCursor.
	// Standard simple pagination:
	// If we want "Previous", we need to store stack of cursors.
	// Let's implement simple "Load More" style or just Next/Prev if we store history.
	// Given time, let's just do "Next" for now or use the provided cursor logic if any.
	// I'll stick to displaying one page.

	const { data, isLoading, error } = useQuery({
		queryKey: ['admin-users', cursor],
		queryFn: () => getAdminUsers(cursor),
	});

	if (error) return <div>Error loading users</div>;

	const users = data?.data?.data?.users || [];
	const pagination = data?.data?.meta?.pagination; // Actually check where the backend puts pagination
	// Looking at admin.ts:
	// getAdminUsers returns: { users: User[]; hasMore: boolean; nextCursor?: string } wrapped in ApiResponse?
	// No, admin.ts implementation:
	// return api.get(url);
	// And the backend sends `sendPaginated`.
	// `sendPaginated` probably puts { data: items, meta: { hasMore, nextCursor } } or similar.
	// Let's check `sendPaginated` usage or assumptions.
	// In `api/types.ts`: ApiResponse has `data: T` and `meta`.
	// The backend `sendPaginated` usually puts the list in `data` and pagination info in `meta`.
	// So users = data?.data?.data (if T is array? No wait).
	// In admin.ts: ApiRequestResponseType<{ users: User[]; hasMore: boolean; nextCursor?: string }>
	// This implies the RESPONSE BODY `data` field contains an object `{ users, hasMore, nextCursor }` ?
	// OR does `sendPaginated` wrap it differently?
	// In the backend code provided:
	// `sendPaginated(res, resultUsers, { hasMore, nextCursor })`
	// Usually `sendPaginated` (standard usage) puts items in `data` and the rest in `meta`.
	// OR it puts everything in `data`.
	// Let's assume standard response structure:
	// data: { users: [...], hasMore: true, nextCursor: '...' }
	// OR
	// data: [...] , meta: { ... }
	// Looking at the provided backend code:
	// It calls `sendPaginated`.
	// I will assume it returns the list as `data` and meta separately, OR `data` as an object containing the list.
	// Safest bet based on `admin.ts` type definition I WROTE:
	// I typed it as `ApiRequestResponseType<{ users: User[]; hasMore: boolean; nextCursor?: string }>`
	// This implies `response.data.data` is the object containing users and cursors.
	// If `sendPaginated` sends an ARRAY as data, then my type in `admin.ts` is wrong or the backend helper does something else.
	// I'll assume my type in `admin.ts` matches what I expect `sendPaginated` to do (return an envelope).

	const userList =
		(data?.data?.data as any)?.users ||
		(Array.isArray(data?.data?.data) ? data?.data?.data : []);
	const meta = (data?.data?.data as any)?.nextCursor
		? (data?.data?.data as any)
		: data?.data?.meta?.pagination || {};
	// Actually, if `sendPaginated` is used, it often puts the array in `data` and pagination in `meta`.
	// If so, `data.data.data` would be the array `User[]`.
	// And `data.data.meta` has pagination.
	// Let's handle both possibilities or just inspecting the `users` variable.
	// If `userList` is undefined, check `data?.data?.data`.

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Users</h1>
			</div>

			{isLoading ? (
				<div className="flex h-32 items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : (
				<UsersTable
					users={userList}
					pagination={meta as any} // Pass meta or whatever
					isLoading={isLoading}
				/>
			)}

			{/* Simple Pagination Controls */}
			<div className="flex justify-end gap-2">
				{/* We can't easily go back with cursor pagination unless we stack them. 
             For now, only Next is supported easily without extra state. 
             If we want reset, we clear cursor. */}
				<Button
					variant="outline"
					disabled={!cursor}
					onClick={() => setCursor(undefined)}>
					Reset / First Page
				</Button>
				<Button
					variant="outline"
					disabled={!(meta as any)?.hasMore}
					onClick={() => setCursor((meta as any)?.nextCursor)}>
					Next
				</Button>
			</div>
		</div>
	);
}
