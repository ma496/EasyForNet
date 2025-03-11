'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import IconCheckboxCheck from '@/components/icons/icon-checkbox-check'

const checkboxVariants = cva(
    ' peer h-3 w-3 grid place-content-center shrink-0 rounded-sm border-[1.5px] border-gray-300 focus-visible:outline-none transition disabled:cursor-not-allowed disabled:opacity-40 ',
    {
        variants: {
            variant: {
                default: 'data-[state=checked]:text-white',
                outline: 'data-[state=checked]:!bg-white',
            },
            color: {
                default:
                    'data-[state=checked]:border-black data-[state=checked]:bg-black',
                primary:
                    'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
                success:
                    'data-[state=checked]:border-success data-[state=checked]:bg-success',
                pending:
                    'data-[state=checked]:border-warning data-[state=checked]:bg-warning',
                danger: 'data-[state=checked]:border-danger data-[state=checked]:bg-danger',
                outlineBlack:
                    'data-[state=checked]:border-black data-[state=checked]:!text-black',
                outlinePrimary:
                    'data-[state=checked]:border-primary data-[state=checked]:!text-primary',
                outlineSuccess:
                    'data-[state=checked]:border-success data-[state=checked]:!text-success',
                outlinePending:
                    'data-[state=checked]:border-warning data-[state=checked]:!text-warning',
                outlineDanger:
                    'data-[state=checked]:border-danger data-[state=checked]:!text-danger',
            },
        },
        defaultVariants: {
            variant: 'default',
            color: 'default',
        },
    },
)

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
        VariantProps<typeof checkboxVariants>
>(({ className, variant, color, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(checkboxVariants({ variant, color, className }))}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}
        >
            <IconCheckboxCheck
                className={cn(
                    'h-1.5 w-1.5',
                    variant === 'outline' ? 'currentcolor' : '',
                )}
            />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
