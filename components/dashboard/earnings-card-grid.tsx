'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import type { DashboardStats } from './types';

export interface EarningsCardGridProps {
	stats: DashboardStats;
	availableBalance?: number;
	onWithdraw?: () => void;
}

const BalanceCard = memo(function BalanceCard({
	balance,
	onWithdraw,
}: {
	balance: number;
	onWithdraw?: () => void;
}) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Available Balance
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-4 text-3xl font-bold text-primary">
					${balance.toLocaleString()}
				</div>
				<Button
					onClick={onWithdraw}
					className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
					Withdraw Earnings
				</Button>
			</CardContent>
		</Card>
	);
});

const MonthlyEarningsCard = memo(function MonthlyEarningsCard({
	amount,
	percentageChange,
}: {
	amount: number;
	percentageChange: number;
}) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle className="text-sm font-medium text-muted-foreground">
					This Month
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-2 text-3xl font-bold">${amount.toFixed(2)}</div>
				<div className="flex items-center gap-1 text-sm text-green-500">
					<TrendingUp className="h-4 w-4" />
					<span>+{percentageChange}% from last month</span>
				</div>
			</CardContent>
		</Card>
	);
});

const LifetimeEarningsCard = memo(function LifetimeEarningsCard({
	amount,
	startDate,
}: {
	amount: number;
	startDate: string;
}) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Lifetime Earnings
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-2 text-3xl font-bold">
					${amount.toLocaleString()}
				</div>
				<p className="text-sm text-muted-foreground">Since {startDate}</p>
			</CardContent>
		</Card>
	);
});

export const EarningsCardGrid = memo(function EarningsCardGrid({
	stats,
	availableBalance = 4287.32,
	onWithdraw,
}: EarningsCardGridProps) {
	return (
		<div className="grid gap-6 md:grid-cols-3">
			<BalanceCard
				balance={availableBalance}
				onWithdraw={onWithdraw}
			/>
			<MonthlyEarningsCard
				amount={stats.monthlyEarnings}
				percentageChange={24.5}
			/>
			<LifetimeEarningsCard
				amount={stats.totalEarnings}
				startDate="January 2024"
			/>
		</div>
	);
});
