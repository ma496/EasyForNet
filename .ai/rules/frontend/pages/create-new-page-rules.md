# Rules for Creating a New Page

This guide outlines the rules and conventions for creating new pages in the frontend application.

## 1. Directory Structure

- **Route Groups**: Place pages in the appropriate route group folder (e.g., `(auth)`, `(public)`, `app`).
- **Hyphen-Case Folders**: Use kebab-case for all page directory names (e.g., `user-profile`, `sales-dashboard`).
- **Private Components**: Place page-specific components in a `_components` directory within the page's directory.

## 2. `page.tsx` Implementation

- **Export**: The page component must be the **default export**.
- **Naming**: Use PascalCase for the component name (e.g., `SalesDashboard`, `UserProfile`).
- **Metadata**: Define and export a `metadata` object of type `Metadata` from `next`.
- **Server vs. Client**:
    - Build pages as **Server Components** by default (do not add `"use client"`).
    - If the page requires client-side interactivity (hooks, event listeners), usually the best practice is to extract that logic into a client component in the `_components` folder and import it into the server page.
    - If the *entire* page must be client-side (uncommon), add `"use client"` at the very top.

### Example `page.tsx`

```tsx
import { Metadata } from 'next'
import React from 'react'
import SomeClientComponent from './_components/some-client-component'

export const metadata: Metadata = {
  title: 'Page Title',
}

const MyPage = () => {
  return (
    <div>
      <h1>Page Heading</h1>
      <SomeClientComponent />
    </div>
  )
}

export default MyPage
```

## 4. `_components` Directory

- Store components that are **only** used by this specific page in a `_components` folder.
- If a component is reusable across multiple pages, place it in `src/frontend/web/components`.
- Use kebab-case for component filenames (e.g., `user-form.tsx`).
- Use PascalCase for component names (e.g., `UserForm`).
- Export the component but not as default.

## 5. Internationalization (i18n)

- Use the global `i18n` configuration for translations.
- For Server Components, use `getTranslationAsync`:
  ```tsx
  import { getTranslationAsync } from '@/i18n'
  // ... inside component
  const { t } = await getTranslationAsync()
  ```
- For Client Components, use the `useTranslation` hook (if available/configured) or pass translations down from the server component.

## 6. Styling

- Use **Tailwind CSS** for all styling.
- Follow the design system defined in `tailwind.config.js` (colors, spacing, etc.).

## 7. Data Fetching (RTK Query)

- **API Slices**: Use the generated hooks from the specific API slice (e.g., `@/store/api/identity/users/users-api`).
- **Queries**:
  - Use standard hooks (e.g., `useUserListQuery`) for automatic data fetching on component mount or prop change.
  - Pass parameters object for pagination, sorting, and filtering.
- **Mutations**:
  - Use mutation hooks (e.g., `useUserCreateMutation`, `useUserDeleteMutation`) for data modification.
  - Destructure the trigger function and state properties (e.g., `isLoading`) as needed.
- **Lazy Queries**:
  - Use lazy query hooks (e.g., `useLazyUserListQuery`) when data fetching is triggered by an event (e.g., export button) or conditional logic.
- **Error Handling**:
  - Errors are handled globally via `src/frontend/web/store/middlewares/rtk-error-middleware.ts`. Use the `unwrap()` method or check the result status if needed for logic, but do not manually implement error alerts for standard API errors as the middleware handles them.

## 8. Localization

- **Translation Files**: Always add translation keys for any new text to:
  - `src/frontend/web/public/locales/en.json` (English)
  - `src/frontend/web/public/locales/ur.json` (Urdu)
- **Keys**: Use snake_case for keys (e.g., `user_profile`, `save_changes`) and nest them logicaly if needed, though flat structure is common.

## 9. Authentication & Permissions

- **Auth URLs**: If a page requires authentication, it must be registered in `src/frontend/web/auth-urls.ts`.
- **Permissions**:
  - If the page requires specific permissions (e.g., viewing a list, creating an item), add the `permissions` array to the config in `auth-urls.ts`.
  - Use constants from `src/frontend/web/allow.ts` (e.g., `Allow.User_View`).
- **New Permissions**:
  - If a required permission does not exist in `allow.ts`, add it.
  - **Important**: The permission string value MUST match the permission name defined in the backend endpoints exactly.

