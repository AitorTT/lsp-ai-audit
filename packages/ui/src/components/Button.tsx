import { forwardRef, type ButtonHTMLAttributes, type ElementRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Spinner } from './Spinner';
import type { LucideIcon } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
        secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
        outline: 'border border-white/20 bg-transparent text-white hover:bg-white/10 focus-visible:ring-brand-400',
        ghost: 'text-white hover:bg-white/10',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: LucideIcon;
}

export const Button = forwardRef<ElementRef<'button'>, ButtonProps>(
  ({ className, variant, size, loading, icon: Icon, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size={16} />
        ) : Icon ? (
          <Icon size={16} />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
