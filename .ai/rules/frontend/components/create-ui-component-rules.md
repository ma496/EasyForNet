# Frontend Component Creation Rules

These rules align with patterns in `src/frontend/web/components/ui` and the project conventions.

## Naming and Location
- Place reusable UI in `src/frontend/web/components/ui`.
- Use `kebab-case` filenames (e.g., `icon-button.tsx`).
- Create paired form-aware variants using Formik with the `Form` prefix (e.g., `input.tsx` and `form-input.tsx`).
- Group complex widgets under a subfolder with re-exports via `index.tsx` (see `data-table`).

## Exports and Structure
- Prefer named exports for primitives; set `displayName` when using `React.forwardRef`.
- Use default export only for compound components that attach statics (e.g., `Modal.Header`).
- Keep public API small and consistent: props control behavior; avoid side effects.

## Consistent Style
- Follow project TypeScript conventions: PascalCase components, camelCase props, `kebab-case` filenames, arrow functions for components and callbacks.
- Order imports: external libraries, project-absolute paths (`@/...`), then relative paths. Group and avoid unused imports.
- Use `const` by default; use `let` only when reassignment is required.
- Merge classes with `cn` and keep order predictable: base classes → variant classes (`cva`) → user `className`. Avoid manual string concatenation for conditionals.
- Use theme tokens from Tailwind config: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `dark`. Do not hardcode hex colors.
- Standardize error UI: container `has-error` when invalid, message as `text-danger mt-1`. Keep validation gated by `showError`/`showValidation`.
- Generate and wire `id` for inputs when absent; connect `<label htmlFor>` consistently across components.
- Maintain controlled patterns for selection components (`value` + `onChange`); minimize internal state except for UI (open/close, search text).
- Provide keyboard support consistently (`Enter`/`Space` toggles) and accessible semantics; prefer Headless UI for complex interactions.
- Consider RTL using global state where layout direction matters (e.g., scrollbars, placement).

## Client Components
- Add the `"use client"` directive for interactive components (inputs, selects, modals).
- Keep server-agnostic components free of browser-only globals.

## Props and Typing
- Define a `Props` interface using TypeScript `interface`.
- Include `className` on all components and merge with existing classes.
- For inputs, accept native attributes via `extends React.*HTMLAttributes<...>` and omit conflicting keys with `Omit`.
- Provide common props where appropriate:
  - `label?: string`
  - `error?: string` and `showError?: boolean`
  - `icon?: React.ReactNode`
  - `size?: 'sm' | 'default' | 'lg'`
  - `variant?:` project theme variants (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `dark`)
- Generate a stable `id` when not provided and associate `<label>` with `htmlFor`.

Examples:

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
  icon?: React.ReactNode
  error?: string
  showError?: boolean
}
```

```tsx
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  showValidation?: boolean
  className?: string
  icon?: React.ReactNode
}
```

References: `components/ui/input.tsx:5`, `components/ui/form-input.tsx:6`.

## Styling and Variants
- Use Tailwind classes aligned to the theme and merge with `cn` from `@/lib/utils`.
- For variantable components, create variant maps with `class-variance-authority` (`cva`) and type them via `VariantProps`.
- Support `size` and `rounded` where relevant; set sensible defaults.

References: `components/ui/button.tsx:1`, `components/ui/icon-button.tsx:6`, `components/ui/checkbox.tsx:6`.

## ForwardRef and DisplayName
- Use `React.forwardRef` for elements that should forward refs (buttons, cards, inputs).
- Set `Component.displayName` to a meaningful name.

References: `components/ui/card.tsx:8`, `components/ui/icon-button.tsx:51`.

## Accessibility
- Connect labels with inputs via `id`/`htmlFor`.
- Provide keyboard interactions (`Enter`/`Space`) for toggles/selects.
- Use accessible libraries for complex widgets:
  - Modals: Headless UI `Dialog` and `Transition` with focus management.
- Avoid non-semantic elements for interactive controls.

References: `components/ui/multi-select.tsx:149`, `components/ui/modal.tsx:96`.

## Internationalization
- Do not hardcode user-visible strings in generic components; accept them via props.
- Use `getTranslation()` inside components that render standard app copy.

References: `components/ui/data-table/data-table.tsx:26`, `components/ui/breadcrumbs.tsx:36`.

## RTL Support
- Use global RTL state when needed and mirror layout or scroll direction.

References: `components/ui/multi-select.tsx:54`.

## Form Integration (Formik)
- Form-aware components use `useField(name)` and show validation on `meta.touched`.
- `Form*` components do not manage value directly; rely on Formik for state and errors.
- For complex value shapes, use `helpers.setValue`.

References: `components/ui/form-input.tsx:22`, `components/ui/form-date-picker.tsx:38`.

## Controlled vs Uncontrolled
- Prefer controlled APIs for selects and multi-selects: require `value` and `onChange`.
- Expose `clear` actions via props or UI affordances.

References: `components/ui/select.tsx:18`, `components/ui/multi-select.tsx:20`.

## Composition and Subcomponents
- Expose compound components by attaching statics on the root and default-exporting it.
- Keep header/footer/content pieces minimal and composable.

References: `components/ui/modal.tsx:144`.

## Directory Organization
- Collocate helper files and context inside a subfolder.
- Provide `index.tsx` or `index.ts` to re-export public pieces.

References: `components/ui/data-table/index.tsx:1`, `components/ui/data-table/context.tsx:1`.

## Example Templates

Primitive with variants and ref:

```tsx
import React, { ButtonHTMLAttributes } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: '...',
      primary: '...',
    },
    size: {
      sm: '...',
      default: '...',
      lg: '...',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface ComponentProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof componentVariants> {
  isLoading?: boolean
}

const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(({ className, variant, size, isLoading, ...props }, ref) => {
  return (
    <button ref={ref} className={cn(componentVariants({ variant, size }), className)} {...props}>
      {isLoading ? '...' : props.children}
    </button>
  )
})

Component.displayName = 'Component'

export { Component }
```

Form-aware input:

```tsx
"use client"
import { useField } from 'formik'
import { cn } from '@/lib/utils'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  showValidation?: boolean
}

export const FormField = ({ label, name, showValidation = true, className, ...props }: FormFieldProps) => {
  const [field, meta] = useField(name)
  const hasError = meta.touched && meta.error

  return (
    <div className={cn(className, meta.touched && (hasError ? 'has-error' : ''))}>
      {label && <label htmlFor={name} className="label form-label">{label}</label>}
      <input {...field} {...props} id={name} className="form-input" />
      {showValidation && meta.touched && hasError && <div className="text-danger mt-1">{meta.error as any}</div>}
    </div>
  )
}
```

## References for Patterns
- Inputs: `components/ui/input.tsx:13`, `components/ui/form-input.tsx:14`
- Buttons: `components/ui/button.tsx:52`, `components/ui/icon-button.tsx:51`
- Cards: `components/ui/card.tsx:8`
- Selects: `components/ui/select.tsx:1`, `components/ui/form-select.tsx:1`
- Multi-select: `components/ui/multi-select.tsx:34`
- Modal: `components/ui/modal.tsx:68`
- Data table: `components/ui/data-table/data-table.tsx:16`, `components/ui/data-table/context.tsx:1`