import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'rounded-xl items-center justify-center flex-row';
  
  const variantClasses = {
    default: 'bg-blue-500 shadow-lg shadow-blue-500/30',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20',
    outline: 'border-2 border-white/30 bg-transparent',
    ghost: 'bg-transparent',
    destructive: 'bg-red-500 shadow-lg shadow-red-500/30',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 min-h-[36px]',
    md: 'px-6 py-3 min-h-[44px]',
    lg: 'px-8 py-4 min-h-[52px]',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text
          className={cn(
            'font-semibold text-white text-center',
            textSizeClasses[size],
            variant === 'outline' && 'text-white/90'
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
