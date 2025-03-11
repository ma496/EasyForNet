'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const chartData = [
    { month: 'June', line1: 10, line2: 20 },
    { month: 'July', line1: 25, line2: 5 },
    { month: 'August', line1: 20, line2: 30 },
    { month: 'September', line1: 35, line2: 1 },
    { month: 'October', line1: 10, line2: 40 },
    { month: 'November', line1: 35, line2: 5 },
    { month: 'December', line1: 40, line2: 50 },
]

const chartConfig = {
    line1: {
        label: 'Line 1',
        color: 'hsl(var(--chart-1))',
    },
    line2: {
        label: 'Line 2',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig

export function LineChart({ className }: { className?: string }) {
    return (
        <Card className="relative flex flex-col justify-between space-y-9 p-5 shadow-sm">
            <span className="text-base/5 font-semibold text-black">
                Simple Area
            </span>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid
                            horizontal={false}
                            vertical={true}
                            strokeDasharray={5}
                            fillOpacity={0.01}
                            className="shrink-0"
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel={true}
                                    label={true}
                                    indicator="dot"
                                    className="min-w-[32px] border-none bg-black px-1.5 py-1 text-xs/[10px] text-white"
                                />
                            }
                        />
                        <defs>
                            <linearGradient
                                id="fillLine1"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#335CFF"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#335CFF"
                                    stopOpacity={0.01}
                                />
                            </linearGradient>
                        </defs>
                        <defs>
                            <linearGradient
                                id="fillLine2"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#22C55E"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#22C55E"
                                    stopOpacity={0.01}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="line1"
                            type="natural"
                            fillOpacity={0.4}
                            stroke="#335CFF"
                            fill="url(#fillLine1)"
                            stackId="a"
                            activeDot={{
                                className:
                                    'fill-[#335CFF] !stroke-white stroke-2',
                                r: 8,
                            }}
                        />
                        <Area
                            dataKey="line2"
                            type="natural"
                            fill="url(#fillLine2)"
                            fillOpacity={0.4}
                            stroke="#22C55E"
                            stackId="a"
                            activeDot={{
                                className:
                                    'fill-[#22C55E] !stroke-white stroke-2',
                                r: 8,
                            }}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
