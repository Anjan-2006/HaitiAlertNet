

import React, { ReactNode } from 'react';
import { useAppContext } from '../contexts/AppContext';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  ...props
}) => {
  const { contrastMode } = useAppContext();

  const baseStyle = 'font-semibold rounded-[var(--input-border-radius)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-70 transition-all duration-200 ease-out inline-flex items-center justify-center active:scale-[0.96] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:brightness-75 hover:scale-[1.03]';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs', 
    md: 'px-6 py-3 text-sm',    
    lg: 'px-8 py-3.5 text-base', 
  };

  const variantStyles = (cm: boolean) => {
    const primaryBg = cm ? 'bg-[var(--current-alert-gradient)]' : 'bg-[var(--current-primary-gradient)]';
    const primaryText = 'text-white';
    const primaryRing = cm ? 'focus:ring-[var(--alert-red)]' : 'focus:ring-[var(--primary-blue)]';
    
    const primaryHoverEffect = cm 
        ? 'hover:brightness-105 hover:!shadow-[0_8px_25px_rgba(var(--alert-red-rgb),0.35)]' 
        : 'hover:brightness-105';

    const dangerBg = 'bg-[var(--current-alert-gradient)]'; 
    const dangerText = 'text-white';
    const dangerRing = 'focus:ring-[var(--alert-red)]';

    return {
      primary: `${primaryBg} ${primaryText} ${primaryRing} ${primaryHoverEffect}`,
      secondary: cm
        ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500'
        : 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400',
      danger: `${dangerBg} ${dangerText} ${dangerRing} hover:brightness-105`,
      outline: cm
        ? 'border border-[var(--alert-red)] text-[var(--alert-red)] hover:bg-[rgba(var(--alert-red-rgb),0.1)] focus:ring-[var(--alert-red)] bg-transparent'
        : 'border border-[var(--primary-blue)] text-[var(--primary-blue)] hover:bg-[rgba(var(--primary-blue-rgb),0.08)] focus:ring-[var(--primary-blue)] bg-transparent',
      ghost: cm
        ? 'text-[var(--alert-red)] hover:bg-[rgba(var(--alert-red-rgb),0.15)] focus:ring-[var(--alert-red)] bg-transparent'
        : 'text-[var(--primary-blue)] hover:bg-[rgba(var(--primary-blue-rgb),0.08)] focus:ring-[var(--primary-blue)] bg-transparent',
    };
  };
  
  const currentVariantStyle = variantStyles(contrastMode)[variant];

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${currentVariantStyle} ${isLoading ? 'opacity-75 cursor-wait' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className={`animate-spin h-5 w-5 ${variant === 'primary' || variant === 'danger' ? 'text-white' : (contrastMode ? 'text-[var(--alert-red)]':'text-[var(--primary-blue)]') }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2.5">{leftIcon}</span>}
      <span className={isLoading ? 'ml-2.5' : ''}>{children}</span>
      {rightIcon && !isLoading && <span className="ml-2.5">{rightIcon}</span>}
    </button>
  );
};

export default Button;