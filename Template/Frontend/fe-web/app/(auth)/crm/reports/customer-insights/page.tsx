'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeading from '@/components/layout/page-heading'
import { DataTable } from '@/components/custom/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarCheck, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { useState } from 'react'

interface ITopCustomer {
  id: string
  name: string
  purchases: number
  totalSpent: string
  averageOrderValue: string
  lastPurchase: string
}

const columns: ColumnDef<ITopCustomer>[] = [
  {
    accessorKey: 'name',
    header: 'Customer Name',
  },
  {
    accessorKey: 'purchases',
    header: 'Total Purchases',
  },
  {
    accessorKey: 'totalSpent',
    header: 'Total Spent',
  },
  {
    accessorKey: 'averageOrderValue',
    header: 'Avg. Order Value',
  },
  {
    accessorKey: 'lastPurchase',
    header: 'Last Purchase',
  },
]

const CustomerInsights = () => {
  const [date, setDate] = useState<Date>()
  const [mainDate, setMainDate] = useState<Date>()

  const topCustomersData: ITopCustomer[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      purchases: 12,
      totalSpent: '$15,750',
      averageOrderValue: '$1,312.50',
      lastPurchase: 'Mar 28, 2024',
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      purchases: 8,
      totalSpent: '$8,920',
      averageOrderValue: '$1,115.00',
      lastPurchase: 'Mar 25, 2024',
    },
    {
      id: '3',
      name: 'Lisa Anderson',
      purchases: 10,
      totalSpent: '$12,300',
      averageOrderValue: '$1,230.00',
      lastPurchase: 'Mar 20, 2024',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 px-4 py-8"
    >
      <PageHeading heading="Customer Insights" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-white to-gray-50 px-6 py-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline-general'} className="hover:bg-gray-50 transition-colors">
                <CalendarCheck className="mr-2 h-4 w-4 text-gray-600" />
                {date ? format(date, 'PP') : <span>Start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="!w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-lg border shadow-lg"
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm font-medium text-gray-600">To</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline-general'} className="hover:bg-gray-50 transition-colors">
                <CalendarCheck className="mr-2 h-4 w-4 text-gray-600" />
                {mainDate ? format(mainDate, 'PPP') : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="!w-auto p-0">
              <Calendar
                mode="single"
                selected={mainDate}
                onSelect={setMainDate}
                initialFocus
                className="rounded-lg border shadow-lg"
              />
            </PopoverContent>
          </Popover>
        </div>
        <Select>
          <SelectTrigger className="w-[200px] bg-white shadow-sm hover:bg-gray-50 transition-colors">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Customers",
            value: "1,274",
            change: "+12%",
            icon: Users,
            color: "from-blue-500/20 to-blue-50",
            iconColor: "text-blue-600"
          },
          {
            title: "Average Order Value",
            value: "$1,245",
            change: "+5.2%",
            icon: ShoppingCart,
            color: "from-green-500/20 to-green-50",
            iconColor: "text-green-600"
          },
          {
            title: "Customer Lifetime Value",
            value: "$4,385",
            change: "+8.4%",
            icon: DollarSign,
            color: "from-purple-500/20 to-purple-50",
            iconColor: "text-purple-600"
          },
          {
            title: "Customer Growth Rate",
            value: "12.5%",
            change: "+2.1%",
            icon: TrendingUp,
            color: "from-orange-500/20 to-orange-50",
            iconColor: "text-orange-600"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card className={`bg-gradient-to-br ${stat.color} border-none shadow-sm hover:shadow-md transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
                <CardTitle className="text-sm font-medium text-gray-800">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-sm font-medium text-gray-600 flex items-center">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl bg-white p-8 shadow-sm"
      >
        <h3 className="mb-6 text-xl font-semibold text-gray-900">Top Performing Customers</h3>
        <DataTable
          columns={columns}
          data={topCustomersData}
          filterField="name"
        />
      </motion.div>
    </motion.div>
  )
}

export default CustomerInsights
