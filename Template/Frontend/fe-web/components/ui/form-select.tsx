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

interface FormSelectProps {
  label?: string;
  name: string;
  options: Option[];
  showValidation?: boolean;
  className?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  isMulti?: boolean;
  searchable?: boolean;
  maxVisibleItems?: number;
  disabled?: boolean;
}

export const FormSelect = ({
  label,
  name,
  options,
  showValidation = true,
  className,
  icon,
  placeholder = "Select...",
  isMulti = false,
  searchable = true,
  maxVisibleItems = 5,
  disabled = false,
}: FormSelectProps) => {
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
  const isSelected = (val: string) =>
    isMulti && Array.isArray(field.value)
      ? field.value.includes(val)
      : field.value === val;

  const handleSelect = (val: string) => {
    if (isMulti) {
      let newValue = Array.isArray(field.value) ? [...field.value] : [];
      if (newValue.includes(val)) {
        newValue = newValue.filter(v => v !== val);
      } else {
        newValue.push(val);
      }
      helpers.setValue(newValue);
    } else {
      helpers.setValue(val);
      setOpen(false);
    }
    helpers.setTouched(true);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    helpers.setValue(isMulti ? [] : "");
    setSearch("");
  };

  // Render selected label(s)
  const renderValue = () => {
    if (isMulti && Array.isArray(field.value) && field.value.length > 0) {
      return options
        .filter(opt => field.value.includes(opt.value))
        .map(opt => opt.label)
        .join(", ");
    }
    const selected = options.find(opt => opt.value === field.value);
    return selected ? selected.label : "";
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
            "form-input flex items-center cursor-pointer min-h-[40px]",
            icon && "ps-10",
            disabled && "opacity-60 pointer-events-none"
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
          <span className={cn("flex-1 truncate", !renderValue() && "text-gray-400")}
          >{renderValue() || placeholder}</span>
          {(field.value && ((isMulti && field.value.length > 0) || (!isMulti && field.value))) && (
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
              "absolute left-0 right-0 mt-1 z-50 bg-white dark:bg-[#1b2e4b] border border-[rgb(224,230,237)] dark:border-[#253b5c] rounded shadow-lg max-h-60 overflow-auto",
              "custom-select"
            )}
            style={{ maxHeight: `${maxVisibleItems * 40}px` }}
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
            <ul className="max-h-48 overflow-auto">
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-gray-400">No options</li>
              )}
              {filteredOptions.map(opt => (
                <li
                  key={opt.value}
                  className={cn(
                    "px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-[#f6f6f6] dark:hover:bg-[#132136]",
                    isSelected(opt.value) && "bg-primary/10 text-primary dark:bg-success dark:text-white",
                    opt.disabled && "opacity-50 pointer-events-none"
                  )}
                  onClick={() => handleSelect(opt.value)}
                >
                  {isMulti && (
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

export default FormSelect;
