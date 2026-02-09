import { Metadata } from 'next'
import React from 'react'
import SaleDashboard from './_components/sale-dashboard'

export const metadata: Metadata = {
  title: 'Sales Admin',
}

const Sales = () => {
  return <SaleDashboard />
}

export default Sales
