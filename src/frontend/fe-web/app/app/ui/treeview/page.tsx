import { Metadata } from "next"
import { TreeviewExample } from "./_components/treeview-example"

export const metadata: Metadata = {
  title: "Treeview",
}

const TreeviewPage = () => {
  return (
    <div className="flex justify-center items-center">
      <TreeviewExample />
    </div>
  )
}

export default TreeviewPage
