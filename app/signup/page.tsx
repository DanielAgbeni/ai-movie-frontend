'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export default function SignUpPage() {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate: register, isPending } = useRegister();

	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		agreeToTerms: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.email || !formData.password || !formData.name) {
			toast({
				title: 'Error',
				description: 'Please fill in all fields',
				variant: 'destructive',
			});
			return;
		}

		// Attempt registration
		register(
			{
				email: formData.email,
				password: formData.password,
				// confirmPassword: formData.password // Assuming api handles this or doesn't need it. sending password as is.
			},
			{
				onSuccess: () => {
					toast({
						title: 'Success',
						description: 'Account created successfully. Please sign in.',
					});
					router.push('/login');
				},
				onError: (error: any) => {
					toast({
						title: 'Error',
						description:
							error.response?.data?.message || 'Something went wrong',
						variant: 'destructive',
					});
				},
			},
		);
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link
						href="/"
						className="inline-block mb-6">
						<Image
							src="/logo.png"
							alt="AI Movies"
							width={200}
							height={60}
							className="mx-auto"
						/>
					</Link>
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Join AI Movies
					</h1>
					<p className="text-muted-foreground">
						Create your account and start your journey
					</p>
				</div>

				<div className="bg-card border border-border rounded-lg p-8">
					<form
						onSubmit={handleSubmit}
						className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
								className="bg-background"
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="your@email.com"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								required
								className="bg-background"
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Create a strong password"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									required
									className="bg-background pr-10"
									disabled={isPending}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									disabled={isPending}>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							<p className="text-xs text-muted-foreground">
								Must be at least 8 characters with a mix of letters and numbers
							</p>
						</div>

						<div className="flex items-start space-x-2">
							<Checkbox
								id="terms"
								checked={formData.agreeToTerms}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, agreeToTerms: checked as boolean })
								}
								disabled={isPending}
							/>
							<label
								htmlFor="terms"
								className="text-sm text-muted-foreground leading-none">
								I agree to the{' '}
								<Link
									href="/terms"
									className="text-primary hover:underline">
									Terms of Service
								</Link>{' '}
								and{' '}
								<Link
									href="/privacy"
									className="text-primary hover:underline">
									Privacy Policy
								</Link>
							</label>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={!formData.agreeToTerms || isPending}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating Account...
								</>
							) : (
								'Create Account'
							)}
						</Button>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-border"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-card px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<Button
								variant="outline"
								className="w-full bg-transparent"
								disabled={isPending}>
								<svg
									className="h-5 w-5 mr-2"
									viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Google
							</Button>
							<Button
								variant="outline"
								className="w-full bg-transparent"
								disabled={isPending}>
								<svg
									className="h-5 w-5 mr-2"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
								GitHub
							</Button>
						</div>
					</div>

					<p className="mt-8 text-center text-sm text-muted-foreground">
						Already have an account?{' '}
						<Link
							href="/login"
							className="text-primary hover:underline font-medium">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
