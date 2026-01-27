'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Upload, User, Menu, Bell } from 'lucide-react';

// Add imports
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { logoutUser } from '@/api/auth';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const { logout, isAuthenticated, user } = useAuthStore();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	const handleLogout = async () => {
		try {
			await logoutUser();
		} catch (error) {
			console.error('Logout failed', error);
		} finally {
			// Clear auth state
			logout();
			// Clear the middleware cookie
			document.cookie =
				'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			// Use hard redirect to ensure middleware sees cleared cookie
			window.location.href = '/login';
		}
	};

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="flex items-center gap-2">
						<Image
							src="/logo.png"
							alt="AI MOVIES - AI HOLLYWOOD"
							width={140}
							height={50}
							className="h-12 w-auto object-contain"
							priority
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center gap-6 md:flex">
						<Link
							href="/browse"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
							Browse
						</Link>
						<Link
							href="/trending"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
							Trending
						</Link>
						<Link
							href="/marketplace"
							className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
							Marketplace
						</Link>
					</nav>
				</div>

				<div className="hidden flex-1 max-w-2xl mx-6 md:flex">
					<form
						onSubmit={handleSearch}
						className="relative w-full">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search movies, shows, documentaries..."
							className="w-full pl-10 bg-secondary/50 border-primary/30 focus:border-primary"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</form>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					{isAuthenticated ? (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="hidden md:flex text-foreground hover:text-primary hover:bg-primary/10">
								<Bell className="h-5 w-5" />
							</Button>

							<Button
								asChild
								className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90">
								<Link href="/upload">
									<Upload className="mr-2 h-4 w-4" />
									Upload
								</Link>
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="text-foreground hover:text-primary hover:bg-primary/10">
										<Avatar className="h-8 w-8">
											<AvatarImage src={user?.avatarUrl} />
											<AvatarFallback>
												{user?.email?.charAt(0).toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-56">
									{user && (
										<>
											<div className="px-2 py-1.5">
												<p className="text-sm font-medium">{user.email}</p>
											</div>
											<DropdownMenuSeparator />
										</>
									)}
									<DropdownMenuItem asChild>
										<Link href="/channel">Your Channel</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/dashboard">Creator Dashboard</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/library">Your Library</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/settings">Settings</Link>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleLogout}>
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<>
							<Button
								variant="ghost"
								asChild
								className="hidden md:flex text-foreground hover:text-primary hover:bg-primary/10">
								<Link href="/login">Sign In</Link>
							</Button>
							<Button
								asChild
								className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90">
								<Link href="/signup">Sign Up</Link>
							</Button>
						</>
					)}

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden text-foreground hover:text-primary hover:bg-primary/10">
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	);
}
