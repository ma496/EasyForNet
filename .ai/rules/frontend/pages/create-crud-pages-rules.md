# Rules for Creating CRUD Pages

This document outlines the standard pattern for creating CRUD (Create, Read, Update, Delete) pages in the frontend application. The `Users` module reference implementation (`src/frontend/web/app/app/(identity)/users`) is the gold standard.

## Directory Structure

Follow this directory structure for a new entity (e.g., `users`):

```text
src/frontend/web/app/app/(group)/users/
├── list/
│   ├── _components/
│   │   └── user-table.tsx
│   └── page.tsx
├── create/
│   ├── _components/
│   │   └── user-create-form.tsx
│   └── page.tsx
└── update/
    └── [id]/
        ├── _components/
        │   └── user-update-form.tsx
        └── page.tsx
```

## Page Components

Page components (`page.tsx`) should be thin wrappers that handle metadata and layout. Logic should be delegated to client components in the `_components` directory.

### List Page
**Path**: `.../list/page.tsx`

```tsx
import { Metadata } from 'next'
import { UserTable } from './_components/user-table'

export const metadata: Metadata = {
  title: 'Users',
}

const Users = () => {
  return <UserTable />
}

export default Users
```

### Create Page
**Path**: `.../create/page.tsx`

```tsx
import { Metadata } from 'next'
import { UserCreateForm } from './_components/user-create-form'

export const metadata: Metadata = {
  title: 'Create User',
}

const UserCreate = () => {
  return (
    <div className="flex items-center justify-center">
      <UserCreateForm />
    </div>
  )
}

export default UserCreate
```

### Update Page
**Path**: `.../update/[id]/page.tsx`
**Note**: Ensure `params` is awaited as per Next.js 15+ conventions.

```tsx
import { Metadata } from 'next'
import { UserUpdateForm } from './_components/user-update-form'

export const metadata: Metadata = {
  title: 'Update User',
}

interface UserUpdatePageProps {
  params: Promise<{
    id: string
  }>
}

const UserUpdate = async ({ params }: UserUpdatePageProps) => {
  const { id } = await params

  return (
    <div className="flex items-center justify-center">
      <UserUpdateForm userId={id} />
    </div>
  )
}

export default UserUpdate
```

## Component Implementation

### General Guidelines
- **Field Discovery**: Identify necessary form fields and table columns by inspecting the specific Request and Response types defined in the RTK Query API.
- **Validation Parity**: Ensure frontend validation (Yup schema) matches the backend endpoint validation rules exactly. Check the backend `Validator` class for constraints (e.g., `RuleFor(x => x.Name).NotEmpty().MaximumLength(50)`).

### Table Component (List)
**Path**: `.../list/_components/user-table.tsx`

- Use `'use client'` directive.
- Use `@tanstack/react-table` for table logic (`createColumnHelper`, `SortingState`, `PaginationState`).
- Use `DataTableProvider`, `DataTableToolbar`, `DataTable`, `DataTablePagination` from `@/components/ui/data-table`.
- Use RTK Query hooks for data fetching (`use[Entity]ListQuery`, `use[Entity]DeleteMutation`).
- Implement `Sorting`, `Pagination`, `Global Filter`, and `Export` functionality.
- Check permissions using `isAllowed`.

```tsx
'use client'
import { useState } from 'react'
import { useUserListQuery, useLazyUserListQuery, useUserDeleteMutation } from '@/store/api/identity/users/users-api'
import { SortDirection } from '@/store/api/base/sort-direction'
import { UserListDto } from '@/store/api/identity/users/dto/user-list-response'
import { Download, Loader2, Trash2, Plus, Pencil } from 'lucide-react'
import { getTranslation } from '@/i18n'
import { ExportFormat, exportData, isAllowed } from '@/lib/utils'
import Dropdown from '@/components/dropdown'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Allow } from '@/allow'
import { createColumnHelper, SortingState, PaginationState } from '@tanstack/react-table'
import { DataTableProvider } from '@/components/ui/data-table/context'
import { DataTableToolbar } from '@/components/ui/data-table/toolbar'
import { DataTablePagination } from '@/components/ui/data-table/pagination'
import { DataTable } from '@/components/ui/data-table'
import { confirmDeleteAlert, errorAlert, successAlert } from '@/lib/utils'

export const UserTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const { t } = getTranslation()

  const isRTL = useAppSelector((state) => state.theme.rtlClass) === 'rtl'

  const {
    data: userListResponse,
    isFetching: isGettingUsers,
  } = useUserListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortField: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
    search: globalFilter,
  })

  const [fetchUsers] = useLazyUserListQuery()
  const [deleteUser] = useUserDeleteMutation()

  const authState = useAppSelector((state) => state.auth)
  const canCreate = isAllowed(authState, [Allow.User_Create])
  const canUpdate = isAllowed(authState, [Allow.User_Update])
  const canDelete = isAllowed(authState, [Allow.User_Delete])

  const handleExport = async (format: ExportFormat, all: boolean) => {
    setIsExporting(true)
    try {
      let dataToExport: UserListDto[] = []
      if (all) {
        const response = await fetchUsers({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          sortField: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
          search: globalFilter,
          all: true,
        })
        if (response.data) {
          dataToExport = response.data?.items
        }
      } else {
        dataToExport = userListResponse?.items || []
      }

      if (dataToExport.length === 0) return

      const rows = dataToExport.map((user) => ({
        Username: user.username,
        Email: user.email,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        Roles: user.roles.map((role) => role.name).join(', '),
      }))
      exportData(format, rows, 'Users', 'users')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDelete = async (userId: string) => {
    const result = await confirmDeleteAlert({
      title: t('delete_user_title'),
      text: t('delete_user_confirmation'),
    })

    if (result.isConfirmed) {
      const response = await deleteUser({ id: userId })
      if (response.data?.success) {
        await successAlert({
          text: t('success_userDeleted'),
        })
      } else if (response.data?.message) {
        await errorAlert({
          text: response.data?.message,
        })
      }
    }
  }

  const columnHelper = createColumnHelper<UserListDto>()
  const columns = [
    columnHelper.accessor('usernameNormalized', {
      header: t('table_users_userName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('emailNormalized', {
      header: t('table_users_email'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('firstName', {
      header: t('table_users_firstName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: t('table_users_lastName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('roles', {
      header: t('table_users_roles'),
      cell: (info) =>
        info
          .getValue()
          .map((role) => role.name)
          .join(', '),
      enableSorting: false,
    }),
    columnHelper.accessor('isActive', {
      header: t('table_users_isActive'),
      cell: (info) =>
        info.getValue() ? <span className="rounded-md bg-green-500 px-2 py-1 text-xs text-white">Yes</span> : <span className="rounded-md bg-red-500 px-2 py-1 text-xs text-white">No</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table_actions'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Link href={`/app/users/update/${info.row.original.id}`} className="btn btn-secondary btn-sm">
              <Pencil className="h-3 w-3" />
            </Link>
          )}
          {canDelete && (
            <button type="button" className="btn cursor-pointer btn-danger btn-sm" onClick={() => handleDelete(info.row.original.id)}>
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ),
    }),
  ]

  return (
    <div className="panel mt-6">
      <DataTableProvider
        data={userListResponse?.items || []}
        rowCount={userListResponse?.total || 0}
        columns={columns}
        enableRowSelection={false}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isGettingUsers}
      >
        <DataTableToolbar title={t('page_users_title')}>
          {canCreate && (
            <Link href="/app/users/create" className="btn flex items-center gap-2 btn-primary">
              <Plus size={16} />
              <span>{t('table_createLink')}</span>
            </Link>
          )}
          <div className="dropdown">
            <Dropdown
              placement={`${isRTL ? 'bottom-start' : 'bottom-end'}`}
              btnClassName="btn btn-primary dropdown-toggle"
              isDisabled={isExporting || isGettingUsers || !userListResponse?.total}
              button={
                <div className="flex items-center gap-2">
                  {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                  <span className="">{t('table_export')}</span>
                </div>
              }
            >
              <ul className="mt-10">
                <li className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-600">{t('table_export_excel')}</li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('excel', false)}>
                    {t('table_export_current_page')}
                  </div>
                </li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('excel', true)}>
                    {t('table_export_all_records')}
                  </div>
                </li>
              </ul>
            </Dropdown>
          </div>
        </DataTableToolbar>

        <DataTable />

        <DataTablePagination siblingCount={1} />
      </DataTableProvider>
    </div>
  )
}
```

### Create Form Component
**Path**: `.../create/_components/user-create-form.tsx`

- Use `'use client'` directive.
- Use `Formik` for form state management.
- Use `Yup` for validation.
- **Type Inference**: Infer the form values type from the Yup schema.
- **Error Handling**: Do not manually show error alerts for mutation failures, global middleware handles them.

```tsx
'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useUserCreateMutation } from '@/store/api/identity/users/users-api'
import { useLazyRoleListQuery } from '@/store/api/identity/roles/roles-api'
import { RoleListRequest } from '@/store/api/identity/roles/dto/role-list-request'
import { Form, Formik } from 'formik'
import { FormPasswordInput } from '@/components/ui/form-password-input'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-input'
import { User, Mail, Lock } from 'lucide-react'
import { FormCheckbox } from '@/components/ui/form-checkbox'
import { RoleListDto } from '@/store/api/identity/roles/dto/role-list-response'
import { FormLazyMultiSelect } from '@/components/ui/form-lazy-multi-select'
import { successAlert } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    username: Yup.string()
      .required(t('validation_required'))
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    email: Yup.string()
      .required(t('validation_required'))
      .email(t('validation_invalidEmail')),
    firstName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    lastName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    password: Yup.string()
      .required(t('validation_required'))
      .min(8, t('validation_minLength', { min: 8 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    confirmPassword: Yup.string()
      .required(t('validation_required'))
      .oneOf([Yup.ref('password')], t('validation_mustMatch', { otherField: t('label_password') })),
    isActive: Yup.boolean().required(),
    roles: Yup.array().of(Yup.string()).required(t('validation_required')),
  })
}

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>

export const UserCreateForm = () => {
  const { t } = getTranslation()
  const validationSchema = createValidationSchema(t)
  const [createUser, { isLoading: isCreatingUser }] = useUserCreateMutation()
  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    const result = await createUser({
      ...data,
      roles: data.roles.filter((role): role is string => role !== undefined),
    })

    if (!result.error) {
      await successAlert({
        text: t('user_create_success'),
      })
      router.push('/app/users/list')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik<FormValues>
        initialValues={{
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
          isActive: true,
          roles: [],
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput name="username" label={t('label_username')} placeholder={t('placeholder_username')} icon={<User size={16} />} autoFocus={true} />
            <FormInput name="email" type="email" label={t('label_email')} placeholder={t('placeholder_email')} icon={<Mail size={16} />} />
            <FormInput name="firstName" label={t('label_firstName')} placeholder={t('placeholder_firstName')} icon={<User size={16} />} />
            <FormInput name="lastName" label={t('label_lastName')} placeholder={t('placeholder_lastName')} icon={<User size={16} />} />
            <FormPasswordInput name="password" label={t('label_password')} placeholder={t('placeholder_password')} icon={<Lock size={16} />} />
            <FormPasswordInput name="confirmPassword" label={t('label_confirmPassword')} placeholder={t('placeholder_confirmPassword')} icon={<Lock size={16} />} />
            <div className="sm:col-span-2">
              <FormLazyMultiSelect<RoleListDto, RoleListRequest>
                name="roles"
                label={t('label_roles')}
                placeholder={t('placeholder_roles')}
                useLazyQuery={useLazyRoleListQuery}
                getLabel={(role) => role.name}
                getValue={(role) => role.id}
                size="sm"
                pageSize={20}
              />
            </div>
            <div className="sm:col-span-2">
              <FormCheckbox name="isActive" label={t('label_isActive')} />
            </div>
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" isLoading={isCreatingUser}>
                {t('create_user')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
```

### Update Form Component
**Path**: `.../update/[id]/_components/user-update-form.tsx`

- Similar to Create Form.
- Accept `userId` as a prop.
- Fetch entity details using `use[Entity]GetQuery`.
- Handle `isLoading` and `!data` states (e.g., return "Loading..." or "Not Found").
- Initialize `Formik` `initialValues` with fetched data.

```tsx
'use client'
import * as Yup from 'yup'
import { getTranslation } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useUserUpdateMutation } from '@/store/api/identity/users/users-api'
import { useUserGetQuery } from '@/store/api/identity/users/users-api'
import { useLazyRoleListQuery } from '@/store/api/identity/roles/roles-api'
import { RoleListRequest } from '@/store/api/identity/roles/dto/role-list-request'
import { Form, Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-input'
import { User } from 'lucide-react'
import { FormCheckbox } from '@/components/ui/form-checkbox'
import { RoleListDto } from '@/store/api/identity/roles/dto/role-list-response'
import { FormLazyMultiSelect } from '@/components/ui/form-lazy-multi-select'
import { useEffect } from 'react'
import { successAlert } from '@/lib/utils'

const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    firstName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    lastName: Yup.string()
      .min(3, t('validation_minLength', { min: 3 }))
      .max(50, t('validation_maxLength', { max: 50 })),
    isActive: Yup.boolean()
      .required(),
    roles: Yup.array().of(Yup.string())
      .required(t('validation_required')),
  })
}

type FormValues = Yup.InferType<ReturnType<typeof createValidationSchema>>

interface UserUpdateFormProps {
  userId: string
}

export const UserUpdateForm = ({ userId }: UserUpdateFormProps) => {
  const { t } = getTranslation()
  const router = useRouter()
  const validationSchema = createValidationSchema(t)
  const { data: userData, isLoading: isLoadingUser } = useUserGetQuery({ id: userId })
  const [fetchRoleList, { data: roleListData, isLoading: isLoadingRoles }] = useLazyRoleListQuery()
  const [updateUser, { isLoading: isUserSaving }] = useUserUpdateMutation()

  useEffect(() => {
    fetchRoleList({
      includeIds: userData?.roles,
    })
  }, [userData])

  if (isLoadingUser || isLoadingRoles) {
    return <div>{t('loading')}</div>
  }

  if (!userData) {
    return <div>{t('user_not_found')}</div>
  }

  const onSubmit = async (data: FormValues) => {
    const result = await updateUser({
      ...data,
      id: userId,
      roles: data.roles.filter((role): role is string => role !== undefined),
    })

    if (!result.error) {
      await successAlert({
        text: t('user_update_success'),
      })
      router.push('/app/users/list')
    }
  }

  return (
    <div className="panel flex min-w-[300px] flex-col gap-4 sm:min-w-[500px]">
      <Formik<FormValues>
        initialValues={{
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          isActive: userData.isActive,
          roles: userData.roles,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form noValidate className="grid grid-cols-1 gap-4">
            <FormInput name="firstName" label={t('label_firstName')} placeholder={t('placeholder_firstName')} icon={<User size={16} />} autoFocus={true} />
            <FormInput name="lastName" label={t('label_lastName')} placeholder={t('placeholder_lastName')} icon={<User size={16} />} />
            <FormLazyMultiSelect<RoleListDto, RoleListRequest>
              name="roles"
              label={t('label_roles')}
              placeholder={t('placeholder_roles')}
              selectedItems={roleListData?.items}
              useLazyQuery={useLazyRoleListQuery}
              getLabel={(role) => role.name}
              getValue={(role) => role.id}
              size="sm"
              pageSize={20}
            />
            <FormCheckbox name="isActive" label={t('label_isActive')} />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isUserSaving}>
                {t('update_user')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
```

## Localization & Permissions

### Localization
- **Add Translations**: Ensure all static text (headings, labels, buttons, success/error messages) has corresponding keys in:
  - `src/frontend/web/public/locales/en.json`
  - `src/frontend/web/public/locales/ur.json`

### Authentication & Permissions
- **Route Registration**: Add the new CRUD routes to `src/frontend/web/auth-urls.ts` with appropriate permissions.
  ```ts
  {
    url: '/app/users/list',
    permissions: [Allow.User_View],
  },
  {
    url: '/app/users/create',
    permissions: [Allow.User_Create],
  },
  {
    url: '/app/users/update/{id}',
    permissions: [Allow.User_Update],
  },
  ```
- **Allow Constants**: defines these permissions in `src/frontend/web/allow.ts`.
  - **Critical**: The value of the permission constant MUST match the permission name used in the backend endpoints (e.g., `User.View`, `User.Create`).
