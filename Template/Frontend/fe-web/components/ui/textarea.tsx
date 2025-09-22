"use client";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
  error?: string;
  showError?: boolean;
}

export const Textarea = ({
  label,
  className,
  error,
  showError = true,
  id,
  ...props
}: TextareaProps) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn(
      className,
      error && showError && 'has-error'
    )}>
      {label && (
        <label htmlFor={textareaId} className="label form-label">{label}</label>
      )}
      <div className="relative text-white-dark">
        <textarea
          {...props}
          id={textareaId}
          className="form-textarea"
        />
      </div>
      {showError && error && (
        <div className="text-danger mt-1">{error}</div>
      )}
    </div>
  );
};
