'use client'

import * as React from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
const chartData = [
    { date: '2024-04-01', desktop: 222 },
    { date: '2024-04-02', desktop: 97 },
    { date: '2024-04-03', desktop: 167 },
    { date: '2024-04-04', desktop: 242 },
    { date: '2024-04-05', desktop: 373 },
    { date: '2024-04-06', desktop: 301 },
    { date: '2024-04-07', desktop: 245 },
    { date: '2024-04-08', desktop: 409 },
    { date: '2024-04-09', desktop: 59 },
    { date: '2024-04-10', desktop: 261 },
    { date: '2024-04-11', desktop: 327 },
    { date: '2024-04-12', desktop: 292 },
    { date: '2024-04-13', desktop: 342 },
    { date: '2024-04-14', desktop: 137 },
    { date: '2024-04-15', desktop: 120 },
    { date: '2024-04-16', desktop: 138 },
    { date: '2024-04-17', desktop: 446 },
    { date: '2024-04-18', desktop: 364 },
    { date: '2024-04-19', desktop: 243 },
    { date: '2024-04-20', desktop: 89 },
    { date: '2024-04-21', desktop: 137 },
    { date: '2024-04-22', desktop: 224 },
    { date: '2024-04-23', desktop: 138 },
    { date: '2024-04-24', desktop: 387 },
    { date: '2024-04-25', desktop: 215 },
    { date: '2024-04-26', desktop: 75 },
    { date: '2024-04-27', desktop: 383 },
    { date: '2024-04-28', desktop: 122 },
    { date: '2024-04-29', desktop: 315 },
    { date: '2024-04-30', desktop: 454 },
    { date: '2024-05-01', desktop: 165 },
    { date: '2024-05-02', desktop: 293 },
    { date: '2024-05-03', desktop: 247 },
]

const chartConfig = {
    views: {
        label: 'Page Views',
    },
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
    },
    mobile: {
        label: 'Mobile',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig

export function LineSingleChart() {
    return (
        <Card className="relative space-y-9 border-2 p-5 shadow-sm flex flex-col justify-between">
            <span className="text-base/5 font-semibold text-black">
                Simple Area
            </span>
            <CardContent className="w-full">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }}
                        />
                        <ChartTooltip
                         cursor={false}
                            content={
                                <ChartTooltipContent
                                hideLabel={true}
                                hideIndicator={true}
                                className="min-w-[32px] border-none bg-black px-1.5 py-1 text-xs/[10px] text-white"
                                formatter={(props: any) => {
                                    return `$${props}`
                                }}
                                />
                            }
                        />
                        <Line
                           dataKey="desktop"
                           type="natural"
                        //    fill="url(#fillDesktop)"
                           fillOpacity={0.2}
                           strokeWidth={2}
                           stroke="#EF4444"
                            dot={false}
                            activeDot={{
                                className:
                                    'fill-[#EAB308] !stroke-white stroke-2',
                                r: 8,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
