import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';
import { cn } from '../lib/utils';
import * as Haptics from 'expo-haptics';

export interface Valve {
  id: string;
  name: string;
  isOnline: boolean;
  isOpen: boolean;
  percentage: number;
  lastUpdate: Date;
  hasAlert?: boolean;
  alertMessage?: string;
}

interface ValveCardProps {
  valve: Valve;
  onToggle: (id: string, isOpen: boolean) => void;
  onPercentageChange: (id: string, percentage: number) => void;
  isOptimistic?: boolean;
}

export function ValveCard({ 
  valve, 
  onToggle, 
  onPercentageChange, 
  isOptimistic = false 
}: ValveCardProps) {
  const handleToggle = async (newValue: boolean) => {
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onToggle(valve.id, newValue);
  };

  const handlePercentagePress = (percentage: number) => {
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPercentageChange(valve.id, percentage);
  };

  return (
    <Card 
      variant={valve.hasAlert ? 'elevated' : 'subtle'} 
      size="lg"
      className={cn(
        'mb-6 transition-all duration-300 bg-white/90',
        isOptimistic && 'opacity-70',
        valve.hasAlert && 'bg-red-50'
      )}
    >
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <Text className="text-slate-900 font-semibold text-2xl mb-2 tracking-wide">
            {valve.name}
          </Text>
          <View className="flex-row items-center">
            <View className={cn(
              'w-3 h-3 rounded-full mr-3',
              valve.isOnline ? 'bg-emerald-500' : 'bg-red-500'
            )} />
            <Text className="text-slate-600 text-base font-medium">
              {valve.isOnline ? 'Online' : 'Offline'}
            </Text>
            <View className="w-1 h-1 bg-white/30 rounded-full mx-3" />
            <Text className="text-slate-600 text-base font-medium">
              {valve.percentage}% Open
            </Text>
          </View>
        </View>
        
        <View className="items-end">
          <Switch
            value={valve.isOpen}
            onValueChange={handleToggle}
            disabled={!valve.isOnline}
          />
          <Text className="text-slate-500 text-xs mt-1 font-medium">
            {valve.isOpen ? 'Active' : 'Closed'}
          </Text>
        </View>
      </View>

      {valve.hasAlert && valve.alertMessage && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <Text className="text-red-700 text-sm">{valve.alertMessage}</Text>
        </View>
      )}

      <View className="border-t border-white/5 pt-4 mt-4">
        <Text className="text-slate-500 text-sm mb-4 font-medium tracking-wide">
          QUICK CONTROLS
        </Text>
        <View className="flex-row justify-between">
          {[0, 25, 50, 75, 100].map((percentage) => (
            <TouchableOpacity
              key={percentage}
              onPress={() => handlePercentagePress(percentage)}
              className={cn(
                'px-4 py-3 rounded-xl transition-all duration-200',
                valve.percentage === percentage 
                  ? 'bg-blue-500/80 border border-blue-400/50' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10',
                !valve.isOnline && 'opacity-50'
              )}
              disabled={!valve.isOnline}
            >
              <Text className={cn(
                'text-sm font-medium text-center',
                valve.percentage === percentage ? 'text-white' : 'text-white/70',
                !valve.isOnline && 'text-white/40'
              )}>
                {percentage}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isOptimistic && (
        <View className="mt-2 px-2 py-1 bg-yellow-500/20 rounded border border-yellow-400/30">
          <Text className="text-yellow-300 text-xs text-center">
            Command queued - waiting for connection
          </Text>
        </View>
      )}
    </Card>
  );
}
