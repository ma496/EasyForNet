'use client'
import { TreeNode, TreeView } from "@/components/ui/treeview";
import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: 'Treeview',
// };

const treeData: TreeNode[] = [
  {
    id: "1",
    label: "Root Item 1",
    children: [
      {
        id: "1.1",
        label: "Child Item 1.1",
        children: [
          { id: "1.1.1", label: "Grandchild 1.1.1" },
          { id: "1.1.2", label: "Grandchild 1.1.2" },
          { id: "1.1.3", label: "Grandchild 1.1.3" },
        ]
      },
      {
        id: "1.2",
        label: "Child Item 1.2",
        children: [
          { id: "1.2.1", label: "Grandchild 1.2.1" },
          { id: "1.2.2", label: "Grandchild 1.2.2" },
          { id: "1.2.3", label: "Grandchild 1.2.3" },
        ]
      }
    ]
  },
  {
    id: "2",
    label: "Root Item 2",
    data: { customData: "example" } // Optional custom data
  }
];

const Treeview = () => {
  return (
    <div className="flex justify-center items-center">
      <TreeView
        className="panel w-[400px]"
        data={treeData}
        defaultExpandedIds={["1", "1.1"]} // Optional: IDs of nodes to expand by default
        onNodeClick={(node) => console.log("Clicked node:", node)} // Optional click handler
        defaultSelectedIds={["1.1"]} // Optional: nodes to select by default
        onSelectionChange={(selectedIds) => {
          console.log("Selected IDs:", selectedIds);
        }}
        enableSelection={true}
      // expandAll={true}
      />
    </div>
  )
};

export default Treeview;