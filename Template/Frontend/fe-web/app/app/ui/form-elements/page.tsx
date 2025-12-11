import { Metadata } from "next"
import { FormElementsExample } from "./_components/form-elements-example"

export const metadata: Metadata = {
  title: "Form Elements",
}

const FormElementsPage = () => {
  return (
    <div className="flex justify-center items-center">
      <FormElementsExample />
    </div>
  )
}

export default FormElementsPage
