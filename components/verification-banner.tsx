'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useIsAuthenticated } from '@/store/useAuthStore';
import { resendVerificationEmail } from '@/api/auth';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function VerificationBanner() {
	const user = useUser();
	const isAuthenticated = useIsAuthenticated();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [isSent, setIsSent] = useState(false);

	// Don't show if not logged in or already verified
	if (!isAuthenticated || !user || user.emailVerified) {
		return null;
	}

	const handleResend = async () => {
		setIsLoading(true);
		try {
			await resendVerificationEmail(user.email);
			setIsSent(true);
			toast({
				title: 'Email Sent',
				description: 'Verification email has been sent successfully.',
			});
		} catch (error: any) {
			toast({
				title: 'Error',
				description:
					error.response?.data?.message || 'Failed to send verification email.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isSent) {
		return (
			<Alert className="rounded-none border-x-0 border-t-0 border-b border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-100">
				<CheckCircle2 className="h-4 w-4" />
				<AlertTitle>Verification Email Sent</AlertTitle>
				<AlertDescription>
					Please check your inbox at <strong>{user.email}</strong> and follow
					the instructions to verify your account.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Alert className="rounded-none border-x-0 border-t-0 border-b border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-200">
			<AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
			<AlertTitle className="text-amber-800 dark:text-amber-300">
				Email Verification Required
			</AlertTitle>
			<AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 sm:mt-0">
				<span className="text-amber-800/90 dark:text-amber-200/90">
					Your email address <strong>{user.email}</strong> has not been verified
					yet. Please verify your email to access all features.
				</span>
				<Button
					size="sm"
					variant="outline"
					className="w-full sm:w-auto border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 hover:text-amber-800 dark:border-amber-400/30 dark:text-amber-300 dark:hover:bg-amber-400/20 dark:hover:text-amber-200 whitespace-nowrap"
					onClick={handleResend}
					disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Sending...
						</>
					) : (
						<>
							<Mail className="mr-2 h-4 w-4" />
							Resend Verification
						</>
					)}
				</Button>
			</AlertDescription>
		</Alert>
	);
}
