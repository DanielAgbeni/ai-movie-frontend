'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import {
	Loader2,
	ArrowRight,
	ArrowLeft,
	KeyRound,
	Mail,
	Eye,
	EyeOff,
} from 'lucide-react';
import { forgotPassword, verifyOtp, resetPassword } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';

// --- Validation Schemas ---
const emailSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

const otpSchema = z.object({
	otp: z.string().length(6, 'OTP must be 6 digits'),
});

const passwordSchema = z
	.object({
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

// --- Step Components ---

// Step 1: Request OTP
function RequestOtpStep({ onSuccess }: { onSuccess: (email: string) => void }) {
	const form = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: '' },
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (data: z.infer<typeof emailSchema>) =>
			forgotPassword(data.email),
		onSuccess: (_, variables) => {
			toast.success('OTP Sent', {
				description: 'Check your email for the verification code',
			});
			onSuccess(variables.email);
		},
		onError: (error: any) => {
			toast.error('Error', {
				description: error.response?.data?.message || 'Failed to send OTP',
			});
		},
	});

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Forgot Password</h1>
				<p className="text-sm text-muted-foreground mt-2">
					Enter your email to receive a verification code
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data) => mutate(data))}
					className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="name@example.com"
										{...field}
										autoComplete="email"
									/>
								</FormControl>
								<FormMessage />
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
								Sending...
							</>
						) : (
							<>
								Send OTP <ArrowRight className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}

// Step 2: Verify OTP
function VerifyOtpStep({
	email,
	onSuccess,
	onBack,
}: {
	email: string;
	onSuccess: (resetToken: string) => void;
	onBack: () => void;
}) {
	const form = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: '' },
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (data: z.infer<typeof otpSchema>) => verifyOtp(email, data.otp),
		onSuccess: (response) => {
			const token = response.data.data.resetToken;
			onSuccess(token);
		},
		onError: (error: any) => {
			toast.error('Invalid OTP', {
				description: error.response?.data?.message || 'Please try again',
			});
		},
	});

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Verify OTP</h1>
				<p className="text-sm text-muted-foreground mt-2">
					Enter the 6-digit code sent to{' '}
					<span className="font-semibold">{email}</span>
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data) => mutate(data))}
					className="space-y-6">
					<FormField
						control={form.control}
						name="otp"
						render={({ field }) => (
							<FormItem className="flex flex-col items-center justify-center">
								<FormControl>
									<InputOTP
										maxLength={6}
										{...field}>
										<InputOTPGroup>
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
										</InputOTPGroup>
										<InputOTPSeparator />
										<InputOTPGroup>
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={5} />
										</InputOTPGroup>
									</InputOTP>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex gap-4">
						<Button
							type="button"
							variant="outline"
							className="flex-1"
							onClick={onBack}
							disabled={isPending}>
							<ArrowLeft className="mr-2 h-4 w-4" /> Back
						</Button>
						<Button
							type="submit"
							className="flex-1"
							disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Verifying...
								</>
							) : (
								'Verify'
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

// Step 3: Reset Password
function ResetPasswordStep({ resetToken }: { resetToken: string }) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<z.infer<typeof passwordSchema>>({
		resolver: zodResolver(passwordSchema),
		defaultValues: { password: '', confirmPassword: '' },
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (data: z.infer<typeof passwordSchema>) =>
			resetPassword({
				token: resetToken,
				password: data.password,
				confirmPassword: data.confirmPassword,
			}),
		onSuccess: () => {
			toast.success('Password Reset Successful', {
				description: 'You can now log in with your new password',
			});
			router.push('/login');
		},
		onError: (error: any) => {
			toast.error('Error', {
				description:
					error.response?.data?.message || 'Failed to reset password',
			});
		},
	});

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold">New Password</h1>
				<p className="text-sm text-muted-foreground mt-2">
					Create a new strong password for your account
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data) => mutate(data))}
					className="space-y-4">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? 'text' : 'password'}
											placeholder="********"
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
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showConfirmPassword ? 'text' : 'password'}
											placeholder="********"
											{...field}
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											disabled={isPending}>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</FormControl>
								<FormMessage />
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
								Resetting...
							</>
						) : (
							'Reset Password'
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}

export default function ForgotPasswordPage() {
	const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
	const [email, setEmail] = useState('');
	const [resetToken, setResetToken] = useState('');

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-6 shadow-lg md:p-8">
				<div className="flex justify-center mb-6">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						{step === 'email' && <Mail className="h-6 w-6 text-primary" />}
						{step === 'otp' && <KeyRound className="h-6 w-6 text-primary" />}
						{step === 'reset' && <KeyRound className="h-6 w-6 text-success" />}
					</div>
				</div>

				{step === 'email' && (
					<RequestOtpStep
						onSuccess={(email) => {
							setEmail(email);
							setStep('otp');
						}}
					/>
				)}

				{step === 'otp' && (
					<VerifyOtpStep
						email={email}
						onSuccess={(token) => {
							setResetToken(token);
							setStep('reset');
						}}
						onBack={() => setStep('email')}
					/>
				)}

				{step === 'reset' && <ResetPasswordStep resetToken={resetToken} />}

				{step === 'email' && (
					<div className="mt-6 text-center text-sm">
						<Link
							href="/login"
							className="text-muted-foreground hover:text-foreground">
							Back to login
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
