import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  isExternal = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D6A84F] focus:ring-offset-2 focus:ring-offset-[#0B0B0C] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantStyles = {
    // Primary Black/Dark with Gold Border Accent (User Rule compliant)
    primary:
      'bg-[#000000] text-[#F5F2EA] border border-[#343438] hover:border-[#D6A84F] hover:bg-[#151517] hover:shadow-[0_0_20px_rgba(214,168,79,0.15)] shadow-md',
    // Solid Gold for high-intent conversion actions
    gold:
      'bg-gradient-to-r from-[#E7C77A] via-[#D6A84F] to-[#C99839] text-[#0B0B0C] font-semibold hover:brightness-110 hover:shadow-[0_0_25px_rgba(214,168,79,0.4)] shadow-lg',
    // Secondary Elevated Surface
    secondary:
      'bg-[#1D1D20] text-[#F5F2EA] border border-[#2A2A2E] hover:bg-[#26262B] hover:border-[#3D3D42]',
    // Clean Outline
    outline:
      'bg-transparent text-[#F5F2EA] border border-[#343438] hover:border-[#D6A84F] hover:text-[#E7C77A] hover:bg-[#151517]/50',
    // Glassmorphic Surface
    glass:
      'bg-white/5 backdrop-blur-md text-[#F5F2EA] border border-white/10 hover:bg-white/10 hover:border-[#D6A84F]/40',
    // Ghost Minimal
    ghost:
      'bg-transparent text-[#A8A5A0] hover:text-[#F5F2EA] hover:bg-white/5',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  const combinedClasses = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClasses}>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
