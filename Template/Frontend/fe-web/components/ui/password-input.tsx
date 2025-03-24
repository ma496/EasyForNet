"use client";

import { useState } from "react";
import { useField } from "formik";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  showValidation?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const PasswordInput = ({
  label,
  name,
  showValidation = true,
  className,
  icon,
  ...props
}: PasswordInputProps) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const hasError = meta.touched && meta.error;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          type={showPassword ? "text" : "password"}
          className={cn("form-input", (icon || true) && "ps-10", "pe-10")}
        />
        {icon && (
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {showValidation && meta.touched && (
        hasError && (
          <div className="text-danger mt-1">{meta.error}</div>
        )
      )}
    </div>
  );
};
