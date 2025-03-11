import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-1.5 text-xs/4 duration-300 whitespace-nowrap outline-none font-medium text-center px-2.5 py-2 rounded-lg disabled:pointer-events-none disabled:opacity-30 transition [&>svg]:size-4 [&>svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-primary text-white hover:bg-[#2A4DD7]',
                black: 'bg-black text-white hover:bg-[#3C3C3D]',
                outline:
                    'ring-1 ring-inset ring-primary bg-white shadow-sm text-primary hover:bg-light-theme',
                'outline-black':
                    'ring-1 ring-inset ring-black bg-white shadow-sm text-black hover:bg-gray-200',
                'outline-general':
                    'ring-1 ring-inset ring-gray-300 bg-white shadow-sm text-black hover:bg-gray-200',
            },
            size: {
                default: '',
                small: '',
                large: 'py-2 px-3 text-sm',
                extralarge:
                    'font-semibold [&>svg]:size-[18px] rounded-[10px] text-sm py-[11px] px-3.5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
