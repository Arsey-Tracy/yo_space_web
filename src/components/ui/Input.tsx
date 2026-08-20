import React, { forwardRef } from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-2xl bg-paper border border-line text-ink text-sm transition-all placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-alert focus-visible:ring-alert',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
