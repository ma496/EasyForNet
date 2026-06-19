import { cn } from '@/lib/utils'
import React from 'react'

/**
 * Props for the Card root component, a styled container that accepts standard div attributes.
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * Card is a rounded, bordered container with light/dark styling that composes the CardHeader, CardTitle, CardContent, and CardFooter subcomponents.
 * It forwards a ref to the underlying div element.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-fit rounded-sm border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none', className)}
      {...props}
    >
      {children}
    </div>
  )
})

/**
 * CardHeader renders the top section of a Card as a flex column container with padding.
 * It forwards a ref to the underlying div element.
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex w-full flex-col space-y-1.5 p-6', className)} {...props} />
))

/**
 * CardTitle renders a heading-3 element used to label a Card's content.
 * It forwards a ref to the underlying heading element.
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-semibold text-dark dark:text-white-light', className)} {...props} />
))

/**
 * CardContent renders the main body area of a Card with horizontal padding and no top padding.
 * It forwards a ref to the underlying div element.
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('w-full p-6 pt-0', className)} {...props} />)

/**
 * CardFooter renders a flex row area at the bottom of a Card, typically used for actions.
 * It forwards a ref to the underlying div element.
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex w-full items-center p-6 pt-0', className)} {...props} />
))

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardTitle.displayName = 'CardTitle'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
