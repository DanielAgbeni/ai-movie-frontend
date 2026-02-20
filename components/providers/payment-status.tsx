'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function PaymentStatus() {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const paymentStatus = searchParams.get('payment');
		const reason = searchParams.get('reason');

		if (!paymentStatus) return;

		if (paymentStatus === 'success') {
			toast.success('Success', {
				description: 'Payment was successful.',
			});
		} else if (paymentStatus === 'failed') {
			toast.error('Payment Failed', {
				description: reason || 'There was an issue processing your payment.',
			});
		}

		// Clean up the URL to remove the payment query parameters
		const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
		newSearchParams.delete('payment');
		newSearchParams.delete('reason');

		const newPathname = `${window.location.pathname}${
			newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
		}`;

		router.replace(newPathname, { scroll: false });
	}, [searchParams, router]);

	return null;
}
