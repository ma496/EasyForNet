"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useField } from "formik";
import { cn } from "@/lib/utils";
import IconCaretDown from "@/components/icon/icon-caret-down";
import IconSearch from "@/components/icon/icon-search";
import IconX from "@/components/icon/icon-x";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface FormMultiSelectProps {
  label?: string;
  name: string;
  options: Option[];
  showValidation?: boolean;
  className?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  searchable?: boolean;
  maxVisibleItems?: number;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

export const FormMultiSelect = ({
  label,
  name,
  options,
  showValidation = true,
  className,
  icon,
  placeholder = "Select...",
  searchable = true,
  maxVisibleItems = 5,
  disabled = false,
  size = 'default',
}: FormMultiSelectProps) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Value helpers
  const isSelected = (val: string) => Array.isArray(field.value) ? field.value.includes(val) : false;

  const handleSelect = (val: string) => {
    let newValue = Array.isArray(field.value) ? [...field.value] : [];
    if (newValue.includes(val)) {
      newValue = newValue.filter(v => v !== val);
    } else {
      newValue.push(val);
    }
    helpers.setValue(newValue)
      .finally(() => helpers.setTouched(true))
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    helpers.setValue([]);
    setSearch("");
  };

  // Render selected label(s) as badges
  const renderValue = () => {
    if (Array.isArray(field.value) && field.value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1 items-center min-h-[28px]">
          {options
            .filter(opt => field.value.includes(opt.value))
            .map(opt => (
              <span
                key={opt.value}
                className="badge badge-outline-secondary flex items-center gap-1 pr-1"
              >
                {opt.label}
                <button
                  type="button"
                  className="ml-1 text-xs text-primary hover:text-danger focus:outline-none"
                  tabIndex={-1}
                  onClick={e => {
                    e.stopPropagation();
                    handleSelect(opt.value);
                  }}
                >
                  <IconX className="h-3 w-3" />
                </button>
              </span>
            ))}
        </div>
      );
    }
    return "";
  };

  return (
    <div
      className={cn(className, meta.touched && hasError && "has-error")}
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
            "form-multiselect flex items-center cursor-pointer min-h-[40px] gap-1 flex-wrap",
            icon && "ps-10",
            disabled && "opacity-60 pointer-events-none",
            size === 'sm' && 'form-multiselect-sm',
            size === 'lg' && 'form-multiselect-lg',
          )}
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
          <span className={cn("flex-1 flex flex-wrap gap-1 items-center min-h-[28px]", !field.value?.length && "text-gray-400")}
          >
            {(Array.isArray(field.value) && field.value.length > 0)
              ? renderValue()
              : (placeholder && (!field.value || field.value.length === 0) && placeholder)}
          </span>
          {(Array.isArray(field.value) && field.value.length > 0) && (
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
              "absolute left-0 mt-1 z-50 bg-white dark:bg-[#1b2e4b] border border-[rgb(224,230,237)] dark:border-[#253b5c] rounded shadow-lg overflow-hidden min-w-full",
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
                    "px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-[#f6f6f6] dark:hover:bg-[#132136]",
                    isSelected(opt.value) && "bg-primary/10 text-primary",
                    opt.disabled && "opacity-50 pointer-events-none"
                  )}
                  onClick={() => handleSelect(opt.value)}
                >
                  {isSelected(opt.value) && (
                    <input
                      type="checkbox"
                      checked={isSelected(opt.value)}
                      readOnly
                      className="form-checkbox h-4 w-4 text-primary"
                    />
                  )}
                  <span>{opt.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showValidation && meta.touched && hasError && (
        <div className="text-danger mt-1">{meta.error}</div>
      )}
    </div>
  );
};
