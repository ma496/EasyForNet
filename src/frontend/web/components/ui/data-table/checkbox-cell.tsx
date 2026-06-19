import { Row } from '@tanstack/react-table'

/** Props for the CheckboxCell, a tanstack-table row-selection checkbox bound to a single table row. */
interface CheckboxCellProps<TData> {
  row: Row<TData>
}

/**
 * CheckboxCell renders a single row's selection checkbox in a data table by wiring it to the row's `getToggleSelectedHandler` from tanstack-react-table.
 */
export function CheckboxCell<TData>({ row }: CheckboxCellProps<TData>) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 cursor-pointer rounded-sm border-2 border-white-light bg-transparent text-primary shadow-none! ring-0! ring-offset-0! outline-hidden! checked:bg-size-[90%_90%] disabled:cursor-not-allowed dark:border-[#253b5c]"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </div>
  )
}

/** Props for the CheckboxHeader, a "select all" checkbox in the data-table header that supports an indeterminate state. */
interface CheckboxHeaderProps {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
}

/**
 * CheckboxHeader renders the header "select-all" checkbox for a data table, exposing a controlled checked/indeterminate state for partial-selection scenarios.
 */
export function CheckboxHeader({ checked, indeterminate, onChange }: CheckboxHeaderProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 cursor-pointer rounded-sm border-2 border-white-light bg-transparent text-primary shadow-none! ring-0! ring-offset-0! outline-hidden! checked:bg-size-[90%_90%] disabled:cursor-not-allowed dark:border-[#253b5c]"
        checked={checked}
        ref={(el) => {
          if (el) {
            el.indeterminate = indeterminate
          }
        }}
        onChange={onChange}
      />
    </div>
  )
}
