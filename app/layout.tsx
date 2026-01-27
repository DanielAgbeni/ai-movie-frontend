import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';
import { Toast, ToastProvider } from '@/components/ui/toast';
import { VerificationBanner } from '@/components/verification-banner';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'AIMovies.ai - AI Hollywood',
	description:
		'The premier platform for AI-generated movies. Upload, share, and monetize your AI creations.',
	generator: 'Daniel Agbeni',
	icons: {
		icon: '/favicon.png',
		apple: '/favicon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-sans antialiased`}>
				<ToastProvider>
					<QueryProvider>
						<VerificationBanner />
						{children}
					</QueryProvider>
					<Toast />
					<Analytics />
				</ToastProvider>
			</body>
		</html>
	);
}
