"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import IconCaretDown from "@/components/icon/icon-caret-down";
import IconSearch from "@/components/icon/icon-search";
import IconX from "@/components/icon/icon-x";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  name: string; // Kept for the 'onChange' handler and <label> 'for'
  options: Option[];
  value: string; // Controlled component value
  onChange: (name: string, value: string) => void; // Standard change handler
  onTouch?: (name: string) => void; // Optional touch handler (for validation)
  error?: string | null; // Validation error from parent
  touched?: boolean; // Touched state from parent
  showValidation?: boolean;
  className?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  searchable?: boolean;
  maxVisibleItems?: number;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg';
  clearable?: boolean;
}

export const Select = ({
  label,
  name,
  options,
  value,
  onChange,
  onTouch,
  error,
  touched,
  showValidation = true,
  className,
  icon,
  placeholder = "Select...",
  searchable = true,
  maxVisibleItems = 5,
  disabled = false,
  size = 'default',
  clearable = true,
}: SelectProps) => {
  const hasError = touched && error;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null!);

  // Filtered options
  const filteredOptions = useMemo(() => {
    if (!searchable || !search) return options;
    return options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options, searchable]);

  // Handle outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onTouch?.(name); // Trigger touch on blur (click-outside)
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, name, onTouch]);

  // Value helpers
  const isSelected = (val: string) => value === val;

  const handleSelect = (val: string) => {
    onChange(name, val); // Call parent onChange
    onTouch?.(name); // Call parent onTouch
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(name, ""); // Call parent onChange with empty value
    onTouch?.(name); // Call parent onTouch
    setSearch("");
  };

  // Get selected option label
  const getSelectedLabel = () => {
    if (!value) return "";
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption?.label || "";
  };

  return (
    <div
      className={cn(className, hasError && "has-error")}
      ref={containerRef}
    >
      {label && <label htmlFor={name}>{label}</label>}
      <div
        className={cn(
          "relative text-white-dark",
          "custom-select"
        )}
      >
        <div
          className={cn(
            "form-input flex items-center cursor-pointer min-h-[40px] gap-1 pr-10",
            icon && "ps-10",
            disabled && "opacity-60 pointer-events-none",
            size === 'sm' && 'py-1.5 text-xs',
            size === 'lg' && 'py-2.5 text-base',
          )}
          style={{ backgroundImage: 'none' }}
          tabIndex={0}
          onClick={() => setOpen(v => !v)}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") setOpen(v => !v);
          }}
        >
          {icon && (
            <span className="absolute start-4 top-1/2 -translate-y-1/2">
              {icon}
            </span>
          )}
          <span className={cn("flex-1 truncate", !value && "text-gray-400")}>
            {value ? getSelectedLabel() : placeholder}
          </span>
          {clearable && value && (
            <button
              type="button"
              className="absolute end-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
              onClick={handleClear}
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
          <span className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <IconCaretDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </span>
        </div>
        {open && (
          <div
            className={cn(
              "absolute left-0 mt-1 z-50 bg-white dark:bg-[#1b2e4b] border border-[rgb(224,230,237)] dark:border-[#253b5c] rounded shadow-lg min-w-full",
              "custom-select"
            )}
            style={{ maxHeight: `${maxVisibleItems * 40 + (searchable ? 50 : 0)}px` }}
          >
            {searchable && (
              <div className="flex items-center px-2 py-2 border-b border-gray-100 dark:border-[#253b5c] bg-white dark:bg-[#1b2e4b] sticky top-0 z-10">
                <IconSearch className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-black dark:text-white-dark"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            <ul className="overflow-auto" style={{ maxHeight: `${maxVisibleItems * 40}px` }}>
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-gray-400">No options</li>
              )}
              {filteredOptions.map(opt => (
                <li
                  key={opt.value}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-[#f6f6f6] dark:hover:bg-[#132136]",
                    isSelected(opt.value) && "bg-primary/10 text-primary",
                    opt.disabled && "opacity-50 pointer-events-none"
                  )}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span>{opt.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showValidation && hasError && (
        <div className="text-danger mt-1">{error}</div>
      )}
    </div>
  );
};
