'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const inputVariants = cva(
    'text-sm/[10px] relative w-full shadow-3xl placeholder:text-gray placeholder:font-medium text-black font-medium px-3.5 py-2.5 rounded-lg disabled:pointer-events-none disabled:opacity-30 focus:ring-1 outline-none focus:ring-black',
    {
        variants: {
            variant: {
                default: '',
                Search: 'border border-gray-300 shadow-sm py-[7px] pl-8 pr-2 text-xs placeholder:text-black',
                'input-form':
                    'focus:outline-[4px] pr-9 focus:outline-primary/20 outline-offset-0 focus:ring-1 focus:ring-primary',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {
    asChild?: boolean
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
    small?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            variant,
            type,
            asChild = false,
            small = false,
            iconLeft = null,
            iconRight = null,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : 'input'
        const [fieldType, setFieldType] = React.useState(type)
        const isIconLeft = iconLeft ? 'pl-9' : ''
        const isIconRight = iconLeft ? 'pr-9' : ''

        return (
            <div className="relative">
                <Comp
                    type={fieldType}
                    className={cn(
                        inputVariants({
                            variant,
                            className,
                        }),
                        isIconLeft,
                        isIconRight,
                    )}
                    ref={ref}
                    {...props}
                />
                {!!iconLeft && (
                    <span
                        className={cn(
                            'text-grey peer-focus:text-dark pointer-events-none absolute left-0 top-0 flex h-9 w-9 items-center justify-center',
                            small ? 'h-[30px] w-[30px]' : 'h-9 w-9',
                        )}
                    >
                        {iconLeft}
                    </span>
                )}

                {!!iconRight && (
                    <span
                        className={cn(
                            'text-grey peer-focus:text-dark pointer-events-none absolute right-0 top-0 flex items-center justify-center',
                            small ? 'h-[30px] w-[30px]' : 'h-9 w-9',
                        )}
                    >
                        {iconRight}
                    </span>
                )}

                {type === 'password' && (
                    <button
                        tabIndex={-1}
                        type="button"
                        className="text-grey peer-focus:text-dark absolute right-0 top-0 flex h-9 w-9 items-center justify-center"
                        onClick={() =>
                            setFieldType(
                                fieldType === 'password' ? 'text' : 'password',
                            )
                        }
                    >
                        {fieldType === 'password' ? (
                            <EyeIcon width={18} height={18} />
                        ) : (
                            <EyeOffIcon
                                width={18}
                                height={18}
                                className="text-grey"
                            />
                        )}
                    </button>
                )}
            </div>
        )
    },
)
Input.displayName = 'Input'

export { Input, inputVariants }
