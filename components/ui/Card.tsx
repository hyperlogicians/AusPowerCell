import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'premium' | 'subtle' | 'premium2';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Card({ children, variant = 'default', size = 'md', className, ...props }: CardProps) {
  const variantClasses = {
    default: 'bg-white/8 backdrop-blur-xl border border-white/15 shadow-lg shadow-black/5',
    glass: 'bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/10',
    elevated: 'bg-white/12 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/15',
    premium: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/20',
    premium2: 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl',
    subtle: 'bg-white/3 backdrop-blur-lg border border-white/8 shadow-md shadow-black/5',
  };

  const sizeClasses = {
    sm: 'rounded-xl p-3',
    md: 'rounded-2xl p-4',
    lg: 'rounded-2xl p-6',
    xl: 'rounded-3xl p-8',
  };

  return (
    <View
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        'overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
