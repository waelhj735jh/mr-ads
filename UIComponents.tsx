
import React, { forwardRef } from 'react';

// --- Spinner ---
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}
export function Spinner({ size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };
  return <div className={`animate-spin rounded-full border-solid border-teal-500 border-t-transparent ${sizeClasses[size]}`}></div>;
}

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
      primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-teal-600 hover:bg-teal-50',
    };
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return (
      <button ref={ref} className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// --- Form Components with Label ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, containerClassName, ...props }, ref) => {
    const generatedId = id || `input-${React.useId()}`;
    return (
      <div className={containerClassName}>
        {label && <label htmlFor={generatedId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input ref={ref} id={generatedId} className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition sm:text-sm ${className}`} {...props} />
      </div>
    );
  }
);
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  containerClassName?: string;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, id, className, containerClassName, children, ...props }, ref) => {
    const generatedId = id || `select-${React.useId()}`;
    return (
      <div className={containerClassName}>
        {label && <label htmlFor={generatedId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <select ref={ref} id={generatedId} className={`w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition sm:text-sm ${className}`} {...props}>
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClassName?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, id, className, containerClassName, ...props }, ref) => {
    const generatedId = id || `textarea-${React.useId()}`;
    return (
      <div className={containerClassName}>
        {label && <label htmlFor={generatedId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <textarea ref={ref} id={generatedId} className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition sm:text-sm ${className}`} {...props} />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
