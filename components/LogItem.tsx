import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/utils';

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  result: 'success' | 'failed' | 'pending';
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}

interface LogItemProps {
  log: AuditLog;
  showTimeline?: boolean;
  isLast?: boolean;
}

export function LogItem({ log, showTimeline = true, isLast = false }: LogItemProps) {
  const resultStyles = {
    success: {
      bg: 'bg-green-500/20',
      text: 'text-green-300',
      dot: 'bg-green-400',
      icon: '✓',
    },
    failed: {
      bg: 'bg-red-500/20',
      text: 'text-red-300',
      dot: 'bg-red-400',
      icon: '✗',
    },
    pending: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-300',
      dot: 'bg-yellow-400',
      icon: '⏳',
    },
  };

  const style = resultStyles[log.result];

  return (
    <View className="flex-row mb-4">
      {showTimeline && (
        <View className="mr-4 items-center">
          <View className={cn('w-3 h-3 rounded-full', style.dot)} />
          {!isLast && (
            <View className="w-0.5 bg-white/20 flex-1 mt-2" />
          )}
        </View>
      )}
      
      <Card variant="glass" className="flex-1">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {log.action}
            </Text>
            <Text className="text-white/70 text-sm mt-1">
              Target: {log.target}
            </Text>
          </View>
          
          <View className={cn('px-2 py-1 rounded-full flex-row items-center', style.bg)}>
            <Text className="text-xs mr-1">{style.icon}</Text>
            <Text className={cn('text-xs font-medium capitalize', style.text)}>
              {log.result}
            </Text>
          </View>
        </View>

        <View className="border-t border-white/10 pt-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-white/60 text-sm">User: {log.user}</Text>
            <Text className="text-white/60 text-xs">
              {formatDate(log.timestamp)}
            </Text>
          </View>
          
          {log.details && (
            <Text className="text-white/50 text-sm mt-1">
              {log.details}
            </Text>
          )}
          
          {log.ipAddress && (
            <Text className="text-white/40 text-xs mt-1">
              IP: {log.ipAddress}
            </Text>
          )}
        </View>
      </Card>
    </View>
  );
}
