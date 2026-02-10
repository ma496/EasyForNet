'use client'
import { TreeNode, TreeView } from '@/components/ui/treeview'
import { PermissionDefinition } from '@/store/api/identity/permissions/permissions-dtos'
import { PermissionDto } from '@/store/api/identity/permissions/permissions-dtos'
import { useGetDefinePermissionsQuery } from '@/store/api/identity/permissions/permissions-api'
import { useRoleGetQuery } from '@/store/api/identity/roles/roles-api'
import { useGetPermissionsQuery } from '@/store/api/identity/permissions/permissions-api'
import { useChangePermissionsMutation } from '@/store/api/identity/roles/roles-api'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { getTranslation } from '@/i18n'
// import { useRouter } from 'next/navigation'
import { useLocalizedRouter } from '@/hooks/use-localized-router'
import AppLoading from '@/components/layouts/app-loading'
import { Search } from 'lucide-react'
import { successToast } from '@/lib/utils'

const toTreeNodes = (definePermissions: PermissionDefinition[], permissions: PermissionDto[]): TreeNode[] => {
  let count = 1
  const buildNode = (definePermission: PermissionDefinition): TreeNode => {
    const permission = permissions.find((p) => p.name === definePermission.name)
    return {
      id: permission ? permission.id : `${definePermission.name}-${count++}`,
      label: definePermission.displayName,
      children: definePermission.children?.map(buildNode) || [],
      show: true,
    }
  }

  return definePermissions.map(buildNode)
}

const isHaveChild = (id: string, nodes: TreeNode[]): boolean => {
  if (!nodes || nodes.length === 0) return false

  const findNode = nodes.find((n) => n.id == id)

  if (findNode?.children && findNode.children.length > 0) {
    return true
  }

  if (!findNode) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const result = isHaveChild(id, node.children)
        if (result) {
          return true
        }
      }
    }
  }

  return false
}

interface ChangePermissionsFormProps {
  roleId: string
}

export const ChangePermissionsForm = ({ roleId }: ChangePermissionsFormProps) => {
  const { data: role, isFetching: isFetchingRole } = useRoleGetQuery({ id: roleId }, { refetchOnMountOrArgChange: true })
  const { data: definePermissionsRes, isLoading: isLoadingDefinePermissions } = useGetDefinePermissionsQuery()
  const { data: permissionsRes, isLoading: isLoadingPermissions } = useGetPermissionsQuery()
  const [changePermissions, { isLoading: isChangingPermissions }] = useChangePermissionsMutation()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [changedPermissions, setChangedPermissions] = useState<string[]>([])
  const { t } = getTranslation()
  const router = useLocalizedRouter()
  const [search, setSearch] = useState('')

  const permissionTreeNodes = useMemo(() => definePermissionsRes && permissionsRes ? toTreeNodes(definePermissionsRes.permissions, permissionsRes.permissions) : [], [definePermissionsRes, permissionsRes])

  const filterTreeNodes = useCallback((nodes: TreeNode[], query: string): void => {
    const filterRecursive = (currentNodes: TreeNode[], currentQuery: string) => {
      if (!currentQuery) {
        currentNodes.forEach((n) => {
          n.show = true
          if (n.children && n.children.length > 0) {
            filterRecursive(n.children, currentQuery)
          }
        })
      } else {
        const normalizedQuery = currentQuery.trim().toLowerCase()
        currentNodes.forEach((n) => {
          if (n.children && n.children.length > 0) {
            filterRecursive(n.children, currentQuery)
            const matchesQuery = n.label.toLowerCase().includes(normalizedQuery)
            const hasVisibleChild = n.children.some((child) => child.show === true)
            n.show = matchesQuery || hasVisibleChild
          } else {
            n.show = n.label.toLowerCase().includes(normalizedQuery)
          }
        })
      }
    }
    filterRecursive(nodes, query)
  }, [])

  useEffect(() => {
    if (role) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPermissions(role.permissions ?? [])
      setChangedPermissions(role.permissions ?? [])
    }
  }, [role])

  useEffect(() => {
    filterTreeNodes(permissionTreeNodes, search)
  }, [search, permissionTreeNodes, filterTreeNodes])

  const handleSubmit = async () => {
    const response = await changePermissions({
      id: roleId,
      permissions: changedPermissions,
    })
    if (!response.error) {
      successToast.fire({
        title: t('page.roles.permissions_update_success'),
      })
      router.push('/app/roles/list')
    }
  }

  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    const permissions = selectedIds.filter((id) => !isHaveChild(id, permissionTreeNodes))
    setChangedPermissions(permissions)
  }, [permissionTreeNodes])

  return (
    <div className="w-min-[300px] panel h-full sm:w-[400px]">
      {!isFetchingRole && !isLoadingDefinePermissions && !isLoadingPermissions ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">
              {role?.name} - {t('page.roles.permissions')}
            </span>
            <div className="relative">
              <input type="text" className="form-input w-auto ltr:pl-9 rtl:pr-9" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Search className="absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300 ltr:left-2 rtl:right-2 dark:text-gray-600" />
            </div>
            <TreeView
              data={permissionTreeNodes}
              defaultSelectedIds={selectedPermissions}
              expandAll={true}
              enableSelection={true}
              onSelectionChange={handleSelectionChange}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="default" onClick={handleSubmit} isLoading={isChangingPermissions}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <AppLoading />
        </div>
      )}
    </div>
  )
}
