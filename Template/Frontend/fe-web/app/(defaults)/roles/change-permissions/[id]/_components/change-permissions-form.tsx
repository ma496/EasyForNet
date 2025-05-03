'use client'
import { TreeNode, TreeView } from "@/components/ui/treeview";
import { PermissionDefinition } from "@/store/api/permissions/dto/permission-definition-response";
import { PermissionDto } from "@/store/api/permissions/dto/permission-response";
import { useGetDefinePermissionsQuery } from "@/store/api/permissions/permissions-api";
import { useRoleGetQuery } from "@/store/api/roles/roles-api";
import { useGetPermissionsQuery } from "@/store/api/permissions/permissions-api";
import { useChangePermissionsMutation } from "@/store/api/roles/roles-api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/i18n";
import { useRouter } from "next/navigation";
import AppLoading from "@/components/layouts/app-loading";
import { Search } from "lucide-react";

const toTreeNodes = (definePermissions: PermissionDefinition[], permissions: PermissionDto[]): TreeNode[] => {
  let count = 1
  const buildNode = (definePermission: PermissionDefinition): TreeNode => {
    const permission = permissions.find(p => p.name === definePermission.name)
    return {
      id: permission ? permission.id : `${definePermission.name}-${count++}`,
      label: definePermission.displayName,
      children: definePermission.children?.map(buildNode) || [],
      show: true
    }
  }

  return definePermissions.map(buildNode)
}

const isHaveChild = (id: string, nodes: TreeNode[]): boolean => {
  if (!nodes || nodes.length === 0) return false

  const findNode = nodes.find(n => n.id == id)

  if (!findNode) {
    nodes.forEach(n => {
      if (n.children && n.children.length > 0) {
        return isHaveChild(id, n.children)
      }
    })
  }

  return findNode?.children ? true : false
}

interface ChangePermissionsFormProps {
  roleId: string;
}

export const ChangePermissionsForm = ({ roleId }: ChangePermissionsFormProps) => {
  const { data: role, isFetching: isFetchingRole } = useRoleGetQuery({ id: roleId }, { refetchOnMountOrArgChange: true })
  const { data: definePermissionsRes, isLoading: isLoadingDefinePermissions } = useGetDefinePermissionsQuery()
  const { data: permissionsRes, isLoading: isLoadingPermissions } = useGetPermissionsQuery()
  const [changePermissions, { isLoading: isChangingPermissions }] = useChangePermissionsMutation()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [changedPermissions, setChangedPermissions] = useState<string[]>([])
  const { t } = getTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('');

  const permissionTreeNodes = definePermissionsRes && permissionsRes ? toTreeNodes(definePermissionsRes.permissions, permissionsRes.permissions) : [];

  const filterTreeNodes = (nodes: TreeNode[], query: string): void => {
    if (!query) {
      // Reset all nodes to visible when no query
      nodes.forEach(n => {
        n.show = true;
        if (n.children && n.children.length > 0) {
          filterTreeNodes(n.children, query);
        }
      });
    } else {
      const normalizedQuery = query.trim().toLowerCase();

      nodes.forEach(n => {
        if (n.children && n.children.length > 0) {
          // Process children first
          filterTreeNodes(n.children, query);

          // Parent node should be visible if it matches the query OR if any child is visible
          const matchesQuery = n.label.toLowerCase().includes(normalizedQuery);
          const hasVisibleChild = n.children.some(child => child.show === true);

          n.show = matchesQuery || hasVisibleChild;
        } else {
          // Leaf nodes are visible only if they match the query
          n.show = n.label.toLowerCase().includes(normalizedQuery);
        }
      });
    }
  };

  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions ?? [])
      setChangedPermissions(role.permissions ?? [])
    }
  }, [role])

  useEffect(() => {
    filterTreeNodes(permissionTreeNodes, search)
  }, [search, permissionTreeNodes])

  const handleSubmit = async () => {
    await changePermissions({
      id: roleId,
      permissions: changedPermissions,
    }).unwrap()
    Swal.fire({
      title: t('success'),
      text: t('permissions_updated_successfully'),
      icon: 'success'
    })
    router.push('/roles/list')
  }

  return (
    <div className="panel w-min-[300px] sm:w-[400px] h-full">
      {
        !isFetchingRole && !isLoadingDefinePermissions && !isLoadingPermissions ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold">{role?.name} - {t('permissions')}</span>
              <div className="relative">
                <input
                  type="text"
                  className="form-input w-auto ltr:pl-9 rtl:pr-9"
                  placeholder={t('search...')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300 dark:text-gray-600 ltr:left-2 rtl:right-2" />
              </div>
              <TreeView
                data={permissionTreeNodes}
                defaultSelectedIds={selectedPermissions}
                expandAll={true}
                enableSelection={true}
                onSelectionChange={(selectedIds) => {
                  const permissions = selectedIds.filter(id => !isHaveChild(id, permissionTreeNodes))
                  setChangedPermissions(permissions)
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="default" onClick={handleSubmit} isLoading={isChangingPermissions}>
                {t('save')}
              </Button>
            </div>
          </div>) : (
          <div className="flex justify-center items-center h-full">
            <AppLoading />
          </div>)
      }
    </div>
  )
};
