import Modal from "@/components/ui/modal";
import { TreeNode, TreeView } from "@/components/ui/treeview";
import { PermissionDefinition } from "@/store/api/permissions/dto/permission-definition-response";
import { PermissionDto } from "@/store/api/permissions/dto/permission-response";

const toTreeNodes = (definePermissions: PermissionDefinition[], permissions: PermissionDto[]): TreeNode[] => {
  let count = 1
  const buildNode = (definePermission: PermissionDefinition): TreeNode => {
    const permission = permissions.find(p => p.name === definePermission.name)
    return {
      id: permission ? permission.id : `${definePermission.name}-${count++}`,
      label: definePermission.displayName,
      children: definePermission.children?.map(buildNode) || []
    }
  }

  return definePermissions.map(buildNode)
}

interface ChangePermissionsProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

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

export const ChangePermissions = ({ show, setShow }: ChangePermissionsProps) => {
  return (
    <Modal isOpen={show} onClose={() => setShow(false)}>
      <Modal.Header>
        <pre>
          <h5 className="text-lg font-semibold dark:text-white-light">Change Permissions</h5>
        </pre>
      </Modal.Header>
      <div>
        <TreeView
          data={treeData}
          // defaultExpandedIds={["1", "1.1", "1.2"]} // Optional: IDs of nodes to expand by default
          onNodeClick={(node) => console.log("Clicked node:", node)} // Optional click handler
          defaultSelectedIds={["1.1"]} // Optional: nodes to select by default
          onSelectionChange={(selectedIds) => {
            console.log("Selected IDs:", selectedIds);
          }}
        />
      </div>
    </Modal>
  )
};
