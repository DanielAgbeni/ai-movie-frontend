'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';
import { toast } from 'sonner';

const signUpSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	agreeToTerms: z.boolean().refine((val) => val === true, {
		message: 'You must agree to the terms and conditions',
	}),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
	const router = useRouter();
	const { mutate: register, isPending } = useRegister();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			agreeToTerms: false,
		},
	});

	const onSubmit = (data: SignUpFormValues) => {
		register(
			{
				email: data.email,
				password: data.password,
				// confirmPassword is not in the schema/API call apparently, simplifying as per previous code
			},
			{
				onSuccess: () => {
					toast.success('Account created successfully. Please sign in.');
					router.push('/login');
				},
				onError: (error: any) => {
					toast.error('Error', {
						description:
							error.response?.data?.message || 'Something went wrong',
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
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												disabled={isPending}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="your@email.com"
												type="email"
												disabled={isPending}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder="Create a strong password"
													disabled={isPending}
													className="pr-10"
													{...field}
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
										</FormControl>
										<FormMessage />
										<p className="text-xs text-muted-foreground">
											Must be at least 8 characters with a mix of letters and
											numbers
										</p>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="agreeToTerms"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isPending}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<label
												htmlFor="agreeToTerms" // Although Checkbox likely handles the ID, labeling for access.
												className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full"
								disabled={isPending}>
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
					</Form>

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
