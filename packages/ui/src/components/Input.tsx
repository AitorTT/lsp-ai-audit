import { forwardRef, type InputHTMLAttributes, type ElementRef } from 'react';
import { cn } from '../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Input = forwardRef<ElementRef<'input'>, InputProps>(
  ({ className, label, error, description, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined}
          {...props}
        />
        {description && !error && (
          <p id={`${inputId}-desc`} className="text-xs text-neutral-500">
            {description}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
