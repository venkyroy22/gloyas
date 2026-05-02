'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-semibold tracking-widest uppercase transition-all duration-300 btn-ripple cursor-pointer';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#0080FF] to-[#59A9F8] text-white hover:from-[#1a8fff] hover:to-[#6fb5f9] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20',
      secondary:
        'bg-transparent border-2 border-[#0080FF] text-[#0080FF] hover:bg-[#0080FF] hover:text-white hover:-translate-y-0.5',
      ghost:
        'bg-transparent text-[#111111] hover:text-[#0080FF] hover:bg-gray-50',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
