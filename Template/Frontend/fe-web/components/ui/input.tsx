"use client";

import { useField } from "formik";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  showValidation?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Input = ({
  label,
  name,
  showValidation = true,
  className,
  icon,
  ...props
}: FormInputProps) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={cn(
      className,
      meta.touched && (hasError ? 'has-error' : '')
    )}>
      {label && (
        <label htmlFor={name}>{label}</label>
      )}
      <div className="relative text-white-dark">
        <input
          {...field}
          {...props}
          id={name}
          className={cn("form-input", icon && "ps-10")}
        />
        {icon && (
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
      </div>
      {showValidation && meta.touched && (
        hasError && (
          <div className="text-danger mt-1">{meta.error}</div>
        )
      )}
    </div>
  );
};
