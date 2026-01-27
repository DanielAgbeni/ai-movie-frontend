'use client';

import { memo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { Transaction } from './types';

export interface TransactionsTableProps {
	transactions: Transaction[];
	title?: string;
	description?: string;
}

const TransactionRow = memo(function TransactionRow({
	transaction,
}: {
	transaction: Transaction;
}) {
	return (
		<TableRow>
			<TableCell>
				<Badge
					variant={transaction.type === 'Purchase' ? 'default' : 'secondary'}>
					{transaction.type}
				</Badge>
			</TableCell>
			<TableCell className="font-medium">{transaction.video}</TableCell>
			<TableCell className="font-semibold text-primary">
				${transaction.amount}
			</TableCell>
			<TableCell className="text-muted-foreground">
				{transaction.date}
			</TableCell>
		</TableRow>
	);
});

export const TransactionsTable = memo(function TransactionsTable({
	transactions,
	title = 'Recent Transactions',
	description = 'Latest sales and rentals',
}: TransactionsTableProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Video</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map((transaction) => (
							<TransactionRow
								key={transaction.id}
								transaction={transaction}
							/>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
});
