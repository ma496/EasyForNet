'use client'

import { ChevronDown } from 'lucide-react'
import { RadialBar, RadialBarChart } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import Image from 'next/image'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
const chartData = [
    { month: 'january', desktop: 15_800, mobile: 8074, other: 3150 },
]

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
    },
    mobile: {
        label: 'Mobile',
        color: 'hsl(var(--chart-2))',
    },
    other: {
        label: 'Other',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig

export function DistributionRadialStackedChart({
    isShowHeader = true,
    isShowTitle = true,
}: {
    className?: string
    isShowHeader?: boolean
    title?: string
    label?: string
    isShowTitle?: boolean
}) {
    return (
        <Card className="relative p-5 shadow-sm min-w-80 xl:min-w-0">
            {isShowTitle && (
                <span className="text-base/5 font-semibold text-black">
                    Donut
                </span>
            )}

            {isShowHeader && (
                <div className="flex items-start justify-between">
                    <div className="space-y-2.5 font-semibold">
                        <p className="text-[10px]/none uppercase">
                            Sales Distribution
                        </p>
                        <h3 className="text-[26px]/8 text-black">$15,800</h3>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={'outline-general'}>
                                Monthly
                                <ChevronDown />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full space-y-1.5 p-1.5">
                            <button
                                type="button"
                                className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight whitespace-nowrap font-medium text-black hover:bg-light-theme"
                            >
                                Yearly
                            </button>
                            <button
                                type="button"
                                className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                            >
                                Quarterly
                            </button>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            <CardContent>
                <div className="relative mt-5">
                    <CardContent className="relative z-10 flex flex-1 items-center pb-0">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-[10/8] w-full sm:aspect-[10/7]"
                        >
                            <RadialBarChart
                                data={chartData}
                                endAngle={180}
                                innerRadius={80}
                                outerRadius={130}
                            >
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            hideLabel={true}
                                            indicator="line"
                                            className="min-w-[32px] border-none bg-black px-1.5 py-1 text-xs/[10px] text-white"
                                        />
                                    }
                                />

                                <RadialBar
                                    dataKey="desktop"
                                    stackId="a"
                                    cornerRadius={5}
                                    fill="#7C3AED"
                                    stroke="white"
                                    className="stroke-transparent stroke-2"
                                />
                                <RadialBar
                                    dataKey="mobile"
                                    fill="#EAB308"
                                    stackId="a"
                                    cornerRadius={5}
                                    stroke="white"
                                    className="stroke-transparent stroke-2"
                                />
                                <RadialBar
                                    dataKey="other"
                                    fill="#22C55E"
                                    stackId="a"
                                    cornerRadius={5}
                                    stroke="white"
                                    className="stroke-transparent stroke-2"
                                />
                            </RadialBarChart>
                        </ChartContainer>
                    </CardContent>
                    <span className="absolute -left-4 -right-4 bottom-10 sm:bottom-5">
                        <Image
                            src="/images/triangle-grid.png"
                            width={400}
                            height={146}
                            alt="sales-chart"
                            className="w-full"
                        />
                    </span>
                </div>
                <div className="relative z-10 -mt-10 flex flex-wrap place-items-center justify-center gap-x-8 gap-y-5 xl:gap-5 p-4 font-semibold xl:grid sm:grid-cols-3">
                    <div className="relative pl-2.5 pr-1.5">
                        <span className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#A78BFA]"></span>
                        <h4 className="text-xs/tight whitespace-nowrap">Website</h4>
                        <p className="mt-1.5 text-lg/tight text-black">
                            $15,800
                        </p>
                    </div>
                    <div className="relative pl-2.5 pr-1.5">
                        <span className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-success"></span>
                        <h4 className="text-xs/tight whitespace-nowrap">Mobile App</h4>
                        <p className="mt-1.5 text-lg/tight text-black">
                            $8,074
                        </p>
                    </div>
                    <div className="relative pl-2.5 pr-1.5">
                        <span className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-warning"></span>
                        <h4 className="text-xs/tight whitespace-nowrap">Other</h4>
                        <p className="mt-1.5 text-lg/tight text-black">
                            $3,150
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
