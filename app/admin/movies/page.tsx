'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminMovies } from '@/api/admin';
import { MoviesTable } from '@/components/admin/movies-table';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MoviesPage() {
	const [cursor, setCursor] = useState<string | undefined>(undefined);
	const [status, setStatus] = useState<'all' | 'active' | 'deleted'>('all');

	const { data, isLoading, error } = useQuery({
		queryKey: ['admin-movies', cursor, status],
		queryFn: () => getAdminMovies(cursor, 20, status),
	});

	if (error) return <div>Error loading movies</div>;

	// Handling potential wrapper differences
	const movies = (data?.data as any)?.movies || (data as any)?.movies || []; // Adjust based on actual API return
	// If `getAdminMovies` uses `api.get`, result is AxiosResponse. data is ApiResponse.
	// If backend returns { movies: [], hasMore: ... } inside `data`:
	const movieList =
		(data?.data?.data as any)?.movies ||
		(Array.isArray(data?.data?.data) ? data?.data?.data : []) ||
		[];
	const meta: any = (data?.data?.data as any)?.nextCursor
		? data?.data?.data
		: data?.data?.meta?.pagination || {};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Movies</h1>
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
				<MoviesTable
					movies={movieList}
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
