import { Row } from '@tanstack/react-table'

interface CheckboxCellProps<TData> {
  row: Row<TData>
}

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

interface CheckboxHeaderProps {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
}

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
