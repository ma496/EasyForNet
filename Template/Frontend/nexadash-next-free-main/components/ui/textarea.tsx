import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'min-h-24 w-full rounded-lg px-3.5 py-3 font-medium leading-tight text-black shadow-3xl outline-none placeholder:font-medium placeholder:text-gray focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)
Textarea.displayName = 'Textarea'

export { Textarea }
