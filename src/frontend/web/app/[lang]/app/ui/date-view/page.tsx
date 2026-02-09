import { Metadata } from 'next'
import { DateViewExample } from './_components/date-view-example'

export const metadata: Metadata = {
  title: 'Date View',
}

const DateViewPage = () => {
  return <DateViewExample />
}

export default DateViewPage
