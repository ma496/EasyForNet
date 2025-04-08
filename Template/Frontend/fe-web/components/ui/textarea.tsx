"use client";

import { useField } from "formik";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    name: string;
    showValidation?: boolean;
    className?: string;
}

export const Textarea = ({
    label,
    name,
    showValidation = true,
    className,
    ...props
}: FormTextareaProps) => {
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
                <textarea
                    {...field}
                    {...props}
                    id={name}
                    className="form-textarea"
                />
            </div>
            {showValidation && meta.touched && (
                hasError && (
                    <div className="text-danger mt-1">{meta.error}</div>
                )
            )}
        </div>
    );
};
