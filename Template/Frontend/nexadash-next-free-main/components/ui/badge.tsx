import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs/[10px] font-medium whitespace-nowrap transition text-black [&>svg]:size-3.5 [&>svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-black text-white',
                primary: 'bg-primary text-white',
                outline:
                    'bg-white shadow-[0_1px_2px_0_rgba(113,116,152,0.1),0_0_0_1px_rgba(227,225,222,0.4)] text-gray',
                success: 'bg-success text-white',
                pending: 'bg-warning text-white',
                danger: 'bg-danger text-white',
                orange: 'bg-light-orange',
                green: 'bg-success-light',
                blue: 'bg-light-blue',
                purple: 'bg-light-purple',
                red: 'bg-danger-light',
                grey: 'bg-gray text-white',
                'grey-700': 'bg-gray-700 text-white',
                'grey-600': 'bg-gray-600 text-white',
                'grey-500': 'bg-gray-500 text-white',
                'grey-400': 'bg-gray-400',
                'grey-300': 'bg-gray-300',
            },
            size: {
                large: 'px-2 py-2.5',
                icon: 'py-1.5',
                small: 'px-1.5 py-[3px] leading-[12px] rounded-full',
                number: 'text-[10px]/[8px] px-1.5 py-1 font-semibold',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
