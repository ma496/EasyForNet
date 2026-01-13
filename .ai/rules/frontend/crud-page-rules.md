# CRUD Page Rules

This document defines the rules and conventions for creating CRUD (Create, Read, Update, Delete) pages in the admin section of the application.

## Directory Structure

A typical CRUD feature should be organized into a directory with subdirectories for each action:

- `src/frontend/web/app/app/feature-group/my-entities/`
  - `list/`
    - `page.tsx` (Server Component)
    - `_components/`
      - `my-entity-table.tsx` (Client Component)
  - `create/`
    - `page.tsx` (Server Component)
    - `_components/`
      - `my-entity-create-form.tsx` (Client Component)
  - `update/[id]/`
    - `page.tsx` (Server Component)
    - `_components/`
      - `my-entity-update-form.tsx` (Client Component)

## List Page Conventions

### Component Structure
- The main `page.tsx` should be a Server Component that only renders the table component from the `_components` directory.
- The table component should be a Client Component using `'use client'`.
- Use the `panel` class for the main container to provide a consistent look.

### Data Table Implementation
- Use `@tanstack/react-table` with the `createColumnHelper` for type-safe columns.
- Use the following UI components for the table structure:
  - `DataTableProvider`: Context provider for table state.
  - `DataTableToolbar`: For titles and action buttons (Create, Export, etc.).
  - `DataTable`: The actual table display.
  - `DataTablePagination`: For table pagination.

### Features
- **Pagination**: Handle `pagination` state using `useState<PaginationState>`. Remember that RTK Query expects 1-based page numbers, while TanStack Table uses 0-based.
- **Sorting**: Handle `sorting` state using `useState<SortingState>`.
- **Filtering**: Handle `globalFilter` for search functionality.
- **Permissions**: Use `isAllowed` and `Allow` constants to conditionally show action buttons (Create, Update, Delete).
- **Deletion**: Use `confirmDeleteAlert` from `@/lib/utils` before calling the delete mutation.
- **Exporting**: Implement export functionality using `exportData` from `@/lib/utils`.

## Form Page Conventions (Create & Update)

### Layout
- Use the `panel` class for the form container.
- For create pages, you can wrap the form in a centered `div`:
  ```tsx
  <div className="flex items-center justify-center">
    <MyEntityCreateForm />
  </div>
  ```

### Formik & Yup
- All forms must use `Formik` for state management and `Yup` for validation.
- Define the validation schema using a function that accepts the translation function `t`.
- Add `noValidate` to the `Form` component to let Formik handle validation.

```tsx
const createValidationSchema = (t: (key: string, params?: any) => string) => {
  return Yup.object().shape({
    name: Yup.string().required(t('validation_required')),
    // ... other fields
  })
}
```

### Specialized Form Components
- Use pre-integrated Formik components from `src/frontend/web/components/ui/form/`:
  - `FormInput`: Standard text/number/email inputs.
  - `FormCheckbox`: For boolean fields.
  - `FormSelect`: For static dropdowns.
  - `FormLazyMultiSelect`: For selecting multiple entities with lazy loading and pagination.
  - `FormPasswordInput`: For password fields with visibility toggle.

### Submission Workflow
1. Call the RTK Query mutation.
2. Check for errors (RTK Query handles global error display, but you should check `!result.error` for flow control).
3. On success, show a `SuccessToast`.
4. Redirect the user back to the list page using `router.push()`.

## Update Page Specifics
- The `update/page.tsx` should receive the `id` from the route params and pass it to the update form component.
- The update form component should use the corresponding `useGet[Entity]Query` to fetch the initial data.
- Ensure the form handles the `isLoading` state while fetching the initial data.

## RTK Query Usage

- **DTO Inspection**: Before implementing components, always read the property definitions of the request and response DTOs for the RTK Query endpoints recursively. This ensures you are using the correct fields and types across nested objects.
- **Error Handling**: You do not need to manually handle or display errors when calling RTK Query endpoints (queries or mutations). Errors are handled at a global level (e.g., via middleware or global toast notifications).
- **Loading States**: Handle loading states within the client components using the `isLoading` or `isFetching` properties returned by RTK Query hooks.

## Permission Handling

- **Permission Identification**: Identify which permissions are required for specific actions (e.g., Create, Update, Delete) by checking the backend endpoints.
- **Permission Definitions**:
  - Backend: Permissions are defined in `src/backend/Source/Permissions/Allow.cs`.
  - Frontend: Permissions are defined in `src/frontend/web/allow.ts`.
- **Using Permissions in Web**: Use `isAllowed` along with the authentication state and the `Allow` constant to check for user permissions.
  ```tsx
  import { Allow } from '@/allow'
  import { isAllowed } from '@/lib/utils'
  import { useAppSelector } from '@/store/hooks'

  const authState = useAppSelector((state) => state.auth)
  const canCreate = isAllowed(authState, [Allow.User_Create])
  const canUpdate = isAllowed(authState, [Allow.User_Update])
  const canDelete = isAllowed(authState, [Allow.User_Delete])

## Localization (I18n)
- All user-facing text (titles, labels, placeholders, validation messages) must be localized using `getTranslation()`.
- Use the `t` function to fetch keys from the translation files.
- Common table keys like `table_actions`, `table_createLink`, etc. are available in the base translations.

## Page Registration

After creating the CRUD pages, they must be registered in the following files to ensure proper navigation, permissions, and searchability:

### 1. Permissions (`src/frontend/web/auth-urls.ts`)
- Add all new page URLs that require specific permissions to the `authUrls` array.
- Use `{id}` for dynamic route segments.
- Example:
  ```typescript
  {
    url: '/app/feature-group/my-entities/list',
    permissions: [Allow.MyEntity_View],
  },
  {
    url: '/app/feature-group/my-entities/create',
    permissions: [Allow.MyEntity_Create],
  },
  {
    url: '/app/feature-group/my-entities/update/{id}',
    permissions: [Allow.MyEntity_Update],
  }
  ```

### 2. Sidebar Navigation (`src/frontend/web/nav-items.ts`)
- Add the new pages to the `navItems` array to make them visible in the sidebar.
- Usually, only the "List" and "Create" pages are shown. "Update" pages should have `show: false`.
- Use translation keys for the `title`.
- Example:
  ```typescript
  {
    title: 'nav_my_entities',
    url: '/app/feature-group/my-entities/list',
    icon: MyIcon,
    children: [
      { title: 'nav_my_entities_list', url: '/app/feature-group/my-entities/list' },
      { title: 'nav_my_entities_create', url: '/app/feature-group/my-entities/create' },
      { title: 'nav_my_entities_update', url: '/app/feature-group/my-entities/update/{id}', show: false },
    ],
  }
  ```

### 3. Global Search (`src/frontend/web/searchable-items.ts`)
- Add the "List" and "Create" pages to the `searchableItems` array to enable quick access via the search bar.
- Use translation keys for the `title`.
- Example:
  ```typescript
  {
    title: 'search_my_entities',
    url: '/app/feature-group/my-entities/list',
  },
  {
    title: 'search_my_entities_create',
    url: '/app/feature-group/my-entities/create',
  }
  ```

## General Conventions

- **Naming**: Use `kebab-case` for file names and directory names.
- **Indentation**: Use 2-space indentation for all frontend files (TSX, TS, CSS, JSON).
- **Reusability**: If a component is used across multiple pages, it should be moved to a more central location like `src/frontend/web/components/` instead of `_components`.
