'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
const chartData = [
    { month: 'Jun', desktop: 90 },
    { month: 'Jul', desktop: 80 },
    { month: 'Aug', desktop: 60 },
    { month: 'Sep', desktop: 100 },
    { month: 'Oct', desktop: 120 },
    { month: 'Nov', desktop: 110 },
    { month: 'Dec', desktop: 140 },
]

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig

export function OnlineSalesAreaChart({
    isCardHeader = true,
    isCardHeaderTitle = true,
    isCardHeaderSubTitle = true,
    isShowTitle = true,
}: {
    className?: string
    isCardHeader?: boolean
    isCardHeaderTitle?: boolean
    isCardHeaderSubTitle?: boolean
    isShowTitle?: boolean
}) {
    return (
        <Card className="relative space-y-9 p-5 shadow-sm  flex flex-col justify-between">
            {isCardHeader && (
                <div className="mb-5 flex items-start justify-between">
                    <div className="space-y-2.5">
                        {isCardHeaderTitle && (
                            <p className="text-[10px]/none uppercase">
                                total online sales
                            </p>
                        )}
                        {isCardHeaderSubTitle && (
                            <h3 className="text-[26px]/8 text-black">
                                $15,244
                                <span className="text-gray-600">.00</span>
                            </h3>
                        )}
                    </div>
                    <Badge
                        variant={'green'}
                        size={'small'}
                        className="rounded-lg font-semibold"
                    >
                        <TrendingUp />
                        15.15%
                    </Badge>
                </div>
            )}
            {isShowTitle && (
                <span className="text-base/5 font-semibold text-black">
                    Simple Area
                </span>
            )}
            <CardContent className="w-full">
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
                            strokeDasharray={4}
                            fillOpacity={0.01}
                            className="shrink-0"
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                            className="font-semibold text-gray-700"
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
                        <defs>
                            <linearGradient
                                id="fillDesktop"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#A78BFA"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#7C3AED"
                                    stopOpacity={0.02}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillMobile"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            fillOpacity={0.2}
                            strokeWidth={2}
                            stroke="#7C3AED"
                            stackId="a"
                            activeDot={{
                                className:
                                    'fill-[#EAB308] !stroke-white stroke-2',
                                r: 8,
                            }}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
