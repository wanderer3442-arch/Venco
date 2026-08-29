import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-label-md font-medium text-on-surface mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full h-12 px-4 rounded-lg border bg-surface-container-lowest
            text-body-md text-on-surface placeholder:text-outline
            transition-all duration-200
            ${error
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
              : 'border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20'
            }
            ${className}
          `}
          {...props}
        />
        {(error || helperText) && (
          <p className={`mt-1.5 text-sm ${error ? 'text-error' : 'text-on-surface-variant'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
