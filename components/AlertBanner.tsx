import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '../lib/utils';
import * as Haptics from 'expo-haptics';

export interface Alert {
  id: string;
  type: 'offline' | 'timeout' | 'mismatch' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  dismissible?: boolean;
}

interface AlertBannerProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function AlertBanner({ alert, onDismiss, className }: AlertBannerProps) {
  const handleDismiss = () => {
    if (onDismiss && alert.dismissible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDismiss(alert.id);
    }
  };

  const typeStyles = {
    offline: {
      bg: 'bg-red-500/20',
      border: 'border-red-400/30',
      text: 'text-red-300',
      icon: '⚠️',
    },
    timeout: {
      bg: 'bg-orange-500/20',
      border: 'border-orange-400/30',
      text: 'text-orange-300',
      icon: '⏱️',
    },
    mismatch: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-400/30',
      text: 'text-yellow-300',
      icon: '⚠️',
    },
    warning: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-400/30',
      text: 'text-amber-300',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-400/30',
      text: 'text-blue-300',
      icon: 'ℹ️',
    },
  };

  const style = typeStyles[alert.type];

  return (
    <View className={cn(
      'rounded-xl p-4 border mb-3',
      style.bg,
      style.border,
      className
    )}>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <Text className="text-lg mr-3">{style.icon}</Text>
          <View className="flex-1">
            <Text className={cn('font-semibold text-base mb-1', style.text)}>
              {alert.title}
            </Text>
            <Text className={cn('text-sm leading-5', style.text, 'opacity-90')}>
              {alert.message}
            </Text>
            <Text className="text-white/50 text-xs mt-2">
              {alert.timestamp.toLocaleTimeString()}
            </Text>
          </View>
        </View>
        
        {alert.dismissible && onDismiss && (
          <TouchableOpacity
            onPress={handleDismiss}
            className="ml-2 p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-white/60 text-lg">×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
