# Page Rules

This document defines the rules and conventions for creating and organizing pages in the frontend.

## Directory Structure

- **Admin Pages**: All admin-related pages must be located in `src/frontend/web/app/app/`.
- **Public Pages**: All public-facing pages must be located in `src/frontend/web/app/(public)/`.
- **Feature Organization**: Use Next.js route groups (directories in parentheses) to organize pages by feature.
  - Example: `app/app/(identity)/users/`
- **Page-Specific Components**: Components that are only used within a specific page must be placed in a `_components` directory within that page's directory.
  - Example: `app/app/users/list/_components/user-table.tsx`

## Page Component Rules

- **Server Components**: The main `page.tsx` file must always be a React Server Component.
- **Page Title**: Every page must specify its title using the Next.js `metadata` export.
  ```tsx
  import { Metadata } from 'next'

  export const metadata: Metadata = {
    title: 'My Page Title',
  }

  const MyPage = () => {
    return <MyComponent />
  }

  export default MyPage
  ```
- **Client Components**: If functionality requires a client component (e.g., using hooks like `useState`, `useEffect`, or RTK Query hooks), create a separate component in the `_components` directory and mark it with `'use client'`.

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
  ```

## Form Rules

- **Formik Integration**: All forms should be implemented using `Formik`.
- **UI Components**: Use form-specific UI components from `src/frontend/web/components/ui/form/`.
- **Form Component Naming**: Components prefixed with `Form` (e.g., `FormInput`, `FormCheckbox`, `FormSelect`) are pre-integrated with Formik and should be used within a Formik context.
- **Validation**: Use `yup` for form validation schemas.

## General Conventions

- **Naming**: Use `kebab-case` for file names and directory names.
- **Indentation**: Use 2-space indentation for all frontend files (TSX, TS, CSS, JSON).
- **I18n**: Use `getTranslation()` from `@/i18n` for localized strings.
- **Reusability**: If a component is used across multiple pages, it should be moved to a more central location like `src/frontend/web/components/` instead of `_components`.
