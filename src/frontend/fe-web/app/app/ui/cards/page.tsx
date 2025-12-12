import { Metadata } from "next"
import { CardsExample } from "./_components/cards-example"

export const metadata: Metadata = {
  title: "Cards",
}

const CardsPage = () => {
  return (
    <div className="flex justify-center items-center">
      <CardsExample />
    </div>
  )
}

export default CardsPage
