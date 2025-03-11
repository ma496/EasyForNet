'use client'

import { TrendingDown } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
const chartData = [
    { month: 'Jun', desktop: 26 },
    { month: 'Jul', desktop: 78 },
    { month: 'Aug', desktop: 62 },
    { month: 'Sep', desktop: 70 },
    { month: 'Oct', desktop: 75 },
    { month: 'Dec', desktop: 105 },
]

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig

const CrossHatchBar = (props: any) => {
    const { x, y, width, height } = props

    return (
        <>
            <defs>
                <pattern
                    id="hatch"
                    patternUnits="userSpaceOnUse"
                    width="16"
                    height="16"
                >
                    <path d="M0,16 L16,0" stroke="#E2E8F0" strokeWidth="2" />
                </pattern>
            </defs>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="url(#hatch)"
                strokeWidth="2"
                rx={8}
                ry={8}
            />
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={'#E2E8F0'}
                opacity={0.5}
                rx={8}
                ry={8}
            />
        </>
    )
}

export function DailySalesBarChart({
    isShowTitle,
}: {
    isShowTitle?: boolean
    className?: string
}) {
    return (
        <Card className="relative flex flex-col justify-between space-y-5 p-5 shadow-sm">
            {!isShowTitle && (
                <span className="text-base/5 font-semibold text-black">
                    Column Stacked
                </span>
            )}
            {isShowTitle && (
                <div className="flex items-start justify-between">
                    <div className="space-y-2.5">
                        <p className="text-[10px]/none uppercase">
                            average daily sales
                        </p>
                        <h3 className="text-[26px]/8 text-black">
                            $3,045
                            <span className="text-gray-600">.00</span>
                        </h3>
                    </div>
                    <Badge
                        variant={'red'}
                        size={'small'}
                        className="rounded-lg font-semibold"
                    >
                        <TrendingDown className="text-black" />
                        8.50%
                    </Badge>
                </div>
            )}
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full">
                    <BarChart accessibilityLayer data={chartData} barGap={1}>
                        <CartesianGrid vertical={false} horizontal={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="font-semibold text-gray-700"
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel={false}
                                    hideIndicator={true}
                                    className="min-w-[32px] border-none bg-black px-1.5 py-1 text-xs/[10px] text-white"
                                    formatter={(props: any) => {
                                        return `${props}%`
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey="desktop"
                            fill="#F5F7FA"
                            radius={8}
                            animationBegin={1000}
                            animationEasing="ease-out"
                            animationDuration={1000}
                            shape={CrossHatchBar}
                        >
                            <LabelList
                                position="top"
                                offset={-20}
                                fill="#171718"
                                fontSize={12}
                                formatter={(props: any) => {
                                    return `${props}%`
                                }}
                            ></LabelList>
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
