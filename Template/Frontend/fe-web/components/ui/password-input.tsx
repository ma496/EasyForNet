"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  showError?: boolean;
}

export const PasswordInput = ({
  label,
  className,
  icon,
  error,
  showError = true,
  id,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          type={showPassword ? "text" : "password"}
          className={cn("form-input", icon && "ps-10", "pe-10")}
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
      {showError && error && (
        <div className="text-danger mt-1">{error}</div>
      )}
    </div>
  );
};
