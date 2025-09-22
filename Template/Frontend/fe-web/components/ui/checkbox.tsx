"use client";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from 'class-variance-authority';

const checkboxVariants = cva(
  "form-checkbox cursor-pointer rounded",
  {
    variants: {
      variant: {
        default: "text-primary border-gray-300 focus:ring-primary",
        success: "text-success border-success focus:ring-success",
        danger: "text-danger border-danger focus:ring-danger",
        warning: "text-warning border-warning focus:ring-warning",
        info: "text-info border-info focus:ring-info",
        secondary: "text-secondary border-secondary focus:ring-secondary",
        dark: "text-dark border-dark focus:ring-dark",
      },
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  VariantProps<typeof checkboxVariants> {
  label?: string;
  className?: string;
  error?: string;
  showError?: boolean;
}

export const Checkbox = ({
  label,
  className,
  variant,
  size,
  error,
  showError = true,
  id,
  ...props
}: CheckboxProps) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn(
      "inline-flex flex-wrap items-start gap-2",
      className,
      error && showError && 'has-error'
    )}>
      <div className="flex items-center min-h-[20px]">
        <input
          {...props}
          type="checkbox"
          id={checkboxId}
          className={cn('mb-0',
            checkboxVariants({ variant, size }),
            error && "border-danger focus:ring-danger"
          )}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "mb-0 cursor-pointer select-none ms-1 leading-none flex items-center",
              size === "sm" && "text-xs",
              size === "default" && "text-sm",
              size === "lg" && "text-base"
            )}
          >
            {label}
          </label>
        )}
      </div>
      {showError && error && (
        <div className="text-danger text-sm">{error}</div>
      )}
    </div>
  );
};
