import Link from 'next/link';
import { Header } from '@/components/header';

export default function NotFound() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
				<div className="relative mb-8">
					<h1 className="text-[8rem] font-black leading-none tracking-tighter text-primary/10 sm:text-[12rem]">
						404
					</h1>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="rounded-2xl bg-card/80 px-8 py-4 shadow-xl backdrop-blur">
							<p className="text-2xl font-bold text-foreground sm:text-3xl">
								Page Not Found
							</p>
						</div>
					</div>
				</div>

				<p className="mb-8 max-w-md text-lg text-muted-foreground">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
					Let&apos;s get you back on track.
				</p>

				<div className="flex flex-wrap items-center justify-center gap-4">
					<Link
						href="/"
						className="inline-flex h-11 items-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
						Go Home
					</Link>
					<Link
						href="/explore"
						className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent">
						Explore Movies
					</Link>
				</div>
			</main>
		</div>
	);
}
