'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardStats } from './types';

export interface EarningsCardGridProps {
	stats: DashboardStats;
	availableBalance?: number;
	percentageChange?: number;
	sinceDate?: string;
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
	const isPositive = percentageChange >= 0;
	const Icon = isPositive ? TrendingUp : TrendingDown;

	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle className="text-sm font-medium text-muted-foreground">
					This Month
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-2 text-3xl font-bold">${amount.toFixed(2)}</div>
				<div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
					<Icon className="h-4 w-4" />
					<span>{isPositive ? '+' : ''}{percentageChange}% from last month</span>
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
	availableBalance = 0,
	percentageChange = 0,
	sinceDate,
	onWithdraw,
}: EarningsCardGridProps) {
	const formattedDate = sinceDate
		? new Date(sinceDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
		: 'N/A';

	return (
		<div className="grid gap-6 md:grid-cols-3">
			<BalanceCard
				balance={availableBalance}
				onWithdraw={onWithdraw}
			/>
			<MonthlyEarningsCard
				amount={stats.monthlyEarnings}
				percentageChange={percentageChange}
			/>
			<LifetimeEarningsCard
				amount={stats.totalEarnings}
				startDate={formattedDate}
			/>
		</div>
	);
});
