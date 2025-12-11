import { Metadata } from "next"
import { ButtonsExample } from "./_components/buttons-example"

export const metadata: Metadata = {
  title: "Buttons",
}

const ButtonsPage = () => {
  return (
    <div className="flex justify-center items-center">
      <ButtonsExample />
    </div>
  )
}

export default ButtonsPage
