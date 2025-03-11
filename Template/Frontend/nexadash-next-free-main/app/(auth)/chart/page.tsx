'use client'

import PageHeading from '@/components/layout/page-heading'
import { OnlineSalesAreaChart } from '@/components/custom/charts/online-sales-area-chart'
import { RadarAreaChart } from '@/components/custom/charts/radar-area-chart'
import { DistributionRadialStackedChart } from '@/components/custom/charts/distribution-radial-stacked-chart'
import { DailySalesBarChart } from '@/components/custom/charts/daily-sales-bar-chart'
import { LineChart } from '@/components/custom/charts/line-chart'
import { LineSingleChart } from '@/components/custom/charts/line-single-chart'
import { DualLineChart } from '@/components/custom/charts/dual-line'
import { LineChart3 } from '@/components/custom/charts/line-chart3'

const Chart = () => {
    return (
        <div className="relative space-y-4">
            <PageHeading heading={'Chart'} />

            <div className="min-h-[calc(100vh_-_160px)] w-full space-y-4">
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    <OnlineSalesAreaChart isCardHeader={false} />
                    <LineSingleChart />
                    <LineChart />
                    <DistributionRadialStackedChart isShowHeader={false} />
                    <RadarAreaChart
                        cardContentClassName="max-h-[400px]"
                        cardclassName="shadow-sm"
                    />
                    <DailySalesBarChart />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <LineChart3 />
                    <DualLineChart />
                </div>
            </div>
        </div>
    )
}
export default Chart
