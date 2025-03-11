'use client'

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

import { Card } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
const chartData = [
    { browser: 'Edge', desktop: 180 },
    { browser: 'Chrome', desktop: 305 },
    { browser: 'IE9+', desktop: 220 },
    { browser: 'Firefox', desktop: 20 },
    { browser: 'Firefox 1', desktop: 190 },
]

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: '#000',
    },
} satisfies ChartConfig

export function RadarAreaChart({
    cardContentClassName,
    cardclassName,
    isShowTitle = true,
}: {
    cardContentClassName?: string
    cardclassName?: string
    isShowTitle?: boolean
}) {
    return (
        <Card
            className={cn('relative space-y-5 p-5 shadow-none', cardclassName)}
        >
            {isShowTitle && (
                <span className="text-base/5 font-semibold text-black">
                    Radar
                </span>
            )}
            <ChartContainer
                config={chartConfig}
                className={cn(
                    'mx-auto aspect-[10/8] max-h-[354px]',
                    cardContentClassName,
                )}
            >
                <RadarChart data={chartData}>
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                hideLabel={false}
                                hideIndicator={true}
                                className="min-w-[32px] border-none bg-black px-1.5 py-1 text-xs/[10px] text-white"
                                formatter={(props: any) => {
                                    return `${props}`
                                }}
                            />
                        }
                    />
                    <PolarAngleAxis dataKey="browser" />
                    <PolarGrid />
                    <defs>
                        <linearGradient
                            key={'fillRadar'}
                            id="fillRadar"
                            x1="1"
                            y1="0"
                            x2="0"
                            y2="0"
                        >
                            <stop
                                offset="5%"
                                stopColor="#A78BFA"
                                stopOpacity={1}
                            />
                            <stop
                                offset="100%"
                                stopColor="#7C3AED"
                                stopOpacity={1}
                            />
                        </linearGradient>
                    </defs>
                    <Radar
                        dataKey="desktop"
                        fill="url(#fillRadar)"
                        fillOpacity={1}
                        activeDot={{
                            className:
                                'fill-[#EAB308] !stroke-[#EAB308]/20 stroke-[4px]',
                            r: 4,
                        }}
                        stroke="white"
                    />
                </RadarChart>
            </ChartContainer>
        </Card>
    )
}
