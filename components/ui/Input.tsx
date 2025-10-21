import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <View className="border border-black/20 bg-black/10 rounded-3xl p-px mb-3">
        {label && (
          <Text className="text-blue-300 text-sm font-medium mt-3 ml-3">
            {label}
          </Text>
        )}
        <View className="relative">
          {leftIcon && (
            <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              {leftIcon}
            </View>
          )}
          <TextInput
            ref={ref}
            className={cn(
              'px-4 pb-1 text-white placeholder:text-white text-base min-h-[44px]',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-red-400',
              className
            )}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            underlineColorAndroid="transparent"
            selectionColor="transparent"
            style={{
              borderWidth: 0,
              outline: 'none',
              boxShadow: 'none',
            }}
            {...props}
          />
          {rightIcon && (
            <View className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
              {rightIcon}
            </View>
          )}
        </View>
        {error && (
          <Text className="text-red-400 text-sm mt-1 ml-1">
            {error}
          </Text>
        )}
      </View>
    );
  }
);
