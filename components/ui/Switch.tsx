import React from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import { cn } from '../../lib/utils';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Switch({ 
  value, 
  onValueChange, 
  disabled = false, 
  size = 'md',
  className 
}: SwitchProps) {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 300,
      friction: 30,
    }).start();
  }, [value, animatedValue]);

  const sizeClasses = {
    sm: { width: 40, height: 24, thumbSize: 18 },
    md: { width: 48, height: 28, thumbSize: 22 },
    lg: { width: 56, height: 32, thumbSize: 26 },
  };

  const { width, height, thumbSize } = sizeClasses[size];

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width - thumbSize - 2],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.3)', '#3B82F6'],
  });

  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      className={cn('justify-center', disabled && 'opacity-50', className)}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{
          width,
          height,
          backgroundColor,
          borderRadius: height / 2,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: thumbSize,
            height: thumbSize,
            backgroundColor: 'white',
            borderRadius: thumbSize / 2,
            transform: [{ translateX: thumbTranslateX }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
