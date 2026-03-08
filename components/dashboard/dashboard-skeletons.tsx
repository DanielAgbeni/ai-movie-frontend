'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function StatsCardGridSkeleton() {
	return (
		<div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<Card key={i} className="border-border bg-card">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-4 rounded" />
					</CardHeader>
					<CardContent>
						<Skeleton className="mb-2 h-7 w-20" />
						<Skeleton className="h-3 w-28" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export function VideoPerformanceSkeleton() {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<Skeleton className="h-5 w-40" />
				<Skeleton className="mt-1 h-4 w-56" />
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-20 w-36 shrink-0 rounded-lg" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-3/4" />
								<div className="flex gap-3">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
							</div>
							<Skeleton className="h-8 w-8 rounded" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function TransactionsTableSkeleton() {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<Skeleton className="h-5 w-40" />
				<Skeleton className="mt-1 h-4 w-36" />
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="flex gap-4 border-b border-border pb-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />
					</div>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex gap-4 py-2">
							<Skeleton className="h-5 w-16 rounded-full" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-14" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function VideoListSkeleton() {
	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<Skeleton className="h-5 w-28" />
					<Skeleton className="mt-1 h-4 w-44" />
				</div>
				<Skeleton className="h-9 w-24 rounded-md" />
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
							<Skeleton className="h-24 w-40 shrink-0 rounded-lg" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-1/2" />
								<div className="flex gap-4">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-5 w-14 rounded-full" />
								</div>
							</div>
							<Skeleton className="h-8 w-8 rounded" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function EarningsCardGridSkeleton() {
	return (
		<div className="grid gap-6 md:grid-cols-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<Card key={i} className="border-border bg-card">
					<CardHeader>
						<Skeleton className="h-4 w-28" />
					</CardHeader>
					<CardContent>
						<Skeleton className="mb-4 h-8 w-24" />
						{i === 0 && <Skeleton className="h-9 w-full rounded-md" />}
						{i > 0 && <Skeleton className="h-4 w-32" />}
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export function EarningsBreakdownSkeleton() {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<Skeleton className="h-5 w-36" />
				<Skeleton className="mt-1 h-4 w-32" />
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-1">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-28" />
								</div>
							</div>
							<Skeleton className="h-5 w-16" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function AnalyticsSkeleton() {
	return (
		<>
			<div className="grid gap-6 md:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<Card key={i} className="border-border bg-card">
						<CardHeader>
							<Skeleton className="h-5 w-36" />
							<Skeleton className="mt-1 h-4 w-40" />
						</CardHeader>
						<CardContent>
							{i === 0 ? (
								<div className="space-y-4">
									{Array.from({ length: 3 }).map((_, j) => (
										<div key={j} className="flex items-center justify-between">
											<Skeleton className="h-4 w-24" />
											<div className="flex items-center gap-2">
												<Skeleton className="h-2 w-32 rounded-full" />
												<Skeleton className="h-4 w-8" />
											</div>
										</div>
									))}
								</div>
							) : (
								<div>
									<Skeleton className="mb-6 h-10 w-20" />
									<div className="space-y-3">
										{Array.from({ length: 3 }).map((_, j) => (
											<div key={j} className="flex justify-between">
												<Skeleton className="h-4 w-28" />
												<Skeleton className="h-4 w-12" />
											</div>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				))}
			</div>
			<Card className="border-border bg-card">
				<CardHeader>
					<Skeleton className="h-5 w-40" />
					<Skeleton className="mt-1 h-4 w-48" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton className="h-8 w-8 rounded-full" />
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="flex-1 space-y-1">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</>
	);
}
