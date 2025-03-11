'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
    {
        browser: 'Design',
        windows: 40,
        macbook: 30,
    },
    {
        browser: 'Editing',
        windows: 28,
        macbook: 20,
    },
    {
        browser: 'Programming',
        windows: 14,
        macbook: 24,
    },
]

const chartConfig = {
    windows: {
        label: 'Windows',
        color: '#22C55E',
    },
    Macbook: {
        label: 'Macbook',
        color: '#EAB308',
    },
} satisfies ChartConfig

const CustomLabel = (props: any) => {
    const { x, y, value } = props
    return (
        <text
            x={x}
            y={y}
            dy={-6}
            textAnchor="start"
            fill="#6B7280"
            fontSize={14}
            className="text-xs leading-tight sm:block xl:text-sm"
        >
            {value}
        </text>
    )
}

export function DualLineChart() {
    return (
        <Card className="relative space-y-5 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-5">
                <span className="shrink-0 text-base/5 font-semibold text-black">
                    Productivity Comparison
                </span>
            </div>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="h-64 w-full xl:h-auto [&_.recharts-legend-wrapper>ul>li>span]:!capitalize [&_.recharts-legend-wrapper>ul>li>span]:!text-black"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                    >
                        <CartesianGrid horizontal={false} />

                        <YAxis
                            dataKey="browser"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            hide
                        />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value ? `${value}K` : value
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    className="min-w-[32px] border-none bg-black px-1.5 py-1 text-xs/[10px] text-white"
                                />
                            }
                        />
                        <Bar
                            dataKey="windows"
                            radius={[10, 0, 0, 10]}
                            barSize={35}
                            fill="#22C55E"
                            stackId="stack"
                            background={{ fill: '#F5F7FA', radius: 10 }}
                        >
                            <LabelList
                                dataKey="browser"
                                content={CustomLabel}
                            />
                        </Bar>
                        <Bar
                            dataKey="macbook"
                            fill="#EAB308"
                            stackId="stack"
                            radius={[0, 10, 10, 0]}
                            barSize={35}
                        />
                        <ChartLegend
                            verticalAlign="top"
                            align="right"
                            iconType="square"
                            iconSize={16}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
