'use client'

import { CartesianGrid, Line, LineChart, YAxis, Tooltip, XAxis } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
    { month: 'January', desktop: 10 },
    { month: 'February', desktop: 20 },
    { month: 'March', desktop: 45 },
    { month: 'April', desktop: 75 },
    { month: 'May', desktop: 25 },
    { month: 'June', desktop: 100 },
    { month: 'July', desktop: 45 },
    { month: 'August', desktop: 90 },
    { month: 'September', desktop: 150 },
    { month: 'October', desktop: 125 },
    { month: 'November', desktop: 50 },
    { month: 'December', desktop: 25 },
]

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: '#171718',
    },
} satisfies ChartConfig

export function LineChart3() {
    return (
        <Card className="relative space-y-5 p-5 shadow-sm">
            <span className="text-base/5 font-semibold text-black">
                Line Chart - Dots
            </span>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart data={chartData}>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray={15}
                            fillOpacity={1}
                            stroke="#E2E8F0"
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            dataKey="desktop"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={28}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
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
                            type="linear"
                            stroke="#171718"
                            strokeWidth={2}
                            dot={{
                                className:
                                    'fill-white !stroke-[#000000] stroke-2',
                                r: 6,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
