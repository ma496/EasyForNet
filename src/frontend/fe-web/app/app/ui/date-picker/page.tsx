import { Metadata } from "next"
import { DatePickerExample } from "./_components/date-picker-example"

export const metadata: Metadata = {
  title: "Date Picker",
}

const DatePickerPage = () => {
  return (
    <div className="flex justify-center items-center">
      <DatePickerExample />
    </div>
  )
}

export default DatePickerPage
