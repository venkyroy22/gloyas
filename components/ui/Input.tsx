import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold tracking-widest uppercase text-[#666666]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border border-[#E8E8E8] bg-white text-[#111111] text-sm font-light
            placeholder:text-[#999999] transition-all duration-200
            focus:outline-none focus:border-[#0080FF] focus:ring-2 focus:ring-[#0080FF]/20
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-light">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
