"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  showError?: boolean;
}

export const Input = ({
  label,
  className,
  icon,
  error,
  showError = true,
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn(
      className,
      error && showError && 'has-error'
    )}>
      {label && (
        <label htmlFor={inputId} className="label form-label">{label}</label>
      )}
      <div className="relative text-white-dark">
        <input
          {...props}
          id={inputId}
          className={cn("form-input", icon && "ps-10")}
        />
        {icon && (
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
      </div>
      {showError && error && (
        <div className="text-danger mt-1">{error}</div>
      )}
    </div>
  );
};
