'use client';

import { useEffect } from 'react';
import { Header } from '@/components/header';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Application error:', error);
	}, [error]);

	return (
		<div className="min-h-screen">
			<Header />
			<main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
				<div className="relative mb-8">
					<h1 className="text-[8rem] font-black leading-none tracking-tighter text-destructive/10 sm:text-[12rem]">
						500
					</h1>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="rounded-2xl bg-card/80 px-8 py-4 shadow-xl backdrop-blur">
							<p className="text-2xl font-bold text-foreground sm:text-3xl">
								Something Went Wrong
							</p>
						</div>
					</div>
				</div>

				<p className="mb-8 max-w-md text-lg text-muted-foreground">
					An unexpected error occurred. Don&apos;t worry, our team has been
					notified and is working on a fix.
				</p>

				<div className="flex flex-wrap items-center justify-center gap-4">
					<button
						onClick={reset}
						className="inline-flex h-11 items-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
						Try Again
					</button>
					<a
						href="/"
						className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent">
						Go Home
					</a>
				</div>

				{error.digest && (
					<p className="mt-6 text-xs text-muted-foreground/60">
						Error ID: {error.digest}
					</p>
				)}
			</main>
		</div>
	);
}
