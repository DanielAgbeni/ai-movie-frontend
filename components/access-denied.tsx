'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { BecomeCreatorModal } from './become-creator-modal';

type AccessDeniedProps = {
	title?: string;
	description?: string;
};

export function AccessDenied({ 
	title = "Creator Access Required",
	description = "You need to be a creator to access this page. Set up your creator profile to start uploading and monetizing your AI-generated movies."
}: AccessDeniedProps) {
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
				<Card className="max-w-lg w-full border-border bg-card">
					<CardHeader className="text-center space-y-4">
						<div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
							<Lock className="h-8 w-8 text-destructive" />
						</div>
						<CardTitle className="text-2xl">{title}</CardTitle>
						<CardDescription className="text-base">
							{description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button 
							className="w-full" 
							size="lg"
							onClick={() => setShowModal(true)}
						>
							<Sparkles className="mr-2 h-5 w-5" />
							Become a Creator
						</Button>
						<Button 
							variant="outline" 
							className="w-full"
							onClick={() => router.push('/')}
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</CardContent>
				</Card>
			</div>

			<BecomeCreatorModal open={showModal} onOpenChange={setShowModal} />
		</>
	);
}
