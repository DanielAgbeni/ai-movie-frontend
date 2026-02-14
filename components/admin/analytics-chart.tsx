'use client';

import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalyticsChartProps {
	title: string;
	data: any[];
	dataKey: string;
	xAxisKey?: string;
	description?: string;
	type?: 'line' | 'bar';
	color?: string;
	height?: number;
}

export function AnalyticsChart({
	title,
	data,
	dataKey,
	xAxisKey = '_id', // Default to _id from aggregation
	description,
	type = 'line',
	color = '#8884d8',
	height = 350,
}: AnalyticsChartProps) {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</CardHeader>
			<CardContent className="pl-2">
				<ResponsiveContainer
					width="100%"
					height={height}>
					{type === 'line' ? (
						<LineChart data={data}>
							<XAxis
								dataKey={xAxisKey}
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `${value}`}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: 'var(--radius)',
									border: '1px solid var(--border)',
									backgroundColor: 'var(--background)',
									color: 'var(--foreground)',
								}}
							/>
							<Line
								type="monotone"
								dataKey={dataKey}
								stroke={color}
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4, strokeWidth: 0 }}
							/>
						</LineChart>
					) : (
						<BarChart data={data}>
							<XAxis
								dataKey={xAxisKey}
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `${value}`}
							/>
							<Tooltip
								cursor={{ fill: 'transparent' }}
								contentStyle={{
									borderRadius: 'var(--radius)',
									border: '1px solid var(--border)',
									backgroundColor: 'var(--background)',
									color: 'var(--foreground)',
								}}
							/>
							<Bar
								dataKey={dataKey}
								fill={color}
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					)}
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
