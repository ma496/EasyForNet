import * as React from 'react'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputSearch = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <div className="relative min-w-[204px]">
                <input
                    type={type}
                    className={cn(
                        'w-full rounded-lg py-2 pl-8 pr-2 text-xs/[10px] font-medium text-black shadow-sm outline-none ring-1 ring-gray-300 placeholder:font-medium placeholder:text-black focus:ring-black disabled:pointer-events-none disabled:opacity-30 [&>svg]:size-4 [&>svg]:shrink-0',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                <Search className="absolute left-3 top-2 h-4 w-4 shrink-0" />
            </div>
        )
    },
)
InputSearch.displayName = 'Input'

export { InputSearch }
