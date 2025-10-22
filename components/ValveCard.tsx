import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';
import { cn } from '../lib/utils';
import * as Haptics from 'expo-haptics';
import { CircleGaugeIcon, Gauge, Droplets, MapPin, CirclePower } from 'lucide-react-native';

import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  BreastPumpIcon,
} from '@hugeicons/core-free-icons';

export interface Valve {
  id: string;
  name: string;
  isOnline: boolean;
  isOpen: boolean;
  percentage: number;
  lastUpdate: Date;
  hasAlert?: boolean;
  alertMessage?: string;
  location?: string;
  pressure?: number;
  flowRate?: number;
  status?: 'online' | 'offline' | 'error';
}

interface ValveCardProps {
  valve: Valve;
  onToggle: (id: string, isOpen: boolean) => void;
  onPercentageChange: (id: string, percentage: number) => void;
  isOptimistic?: boolean;
  isSelected?: boolean;
}

export function ValveCard({ 
  valve, 
  onToggle, 
  onPercentageChange, 
  isOptimistic = false,
  isSelected = false,
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

  // Determine card theme based on status
  const getCardTheme = () => {
    if (valve.status === 'error' || valve.hasAlert) {
      return {
        topBar: 'bg-red-400',
        background: 'bg-red-50',
        border: 'border-red-200',
        iconColor: 'red',
        statusColor: 'red',
        statusText: 'Error',
        powerColor: 'gray'
      };
    } else if (valve.isOnline && valve.isOpen) {
      return {
        topBar: 'bg-green-400',
        background: 'bg-green-50',
        border: 'border-green-200',
        iconColor: 'green',
        statusColor: 'green',
        statusText: 'Online',
        powerColor: 'green'
      };
    } else if (valve.isOnline && !valve.isOpen) {
      return {
        topBar: 'bg-gray-300',
        background: 'bg-gray-50',
        border: 'border-gray-200',
        iconColor: 'gray',
        statusColor: 'green',
        statusText: 'Online',
        powerColor: 'gray'
      };
    } else {
      return {
        topBar: 'bg-gray-300',
        background: 'bg-gray-50',
        border: 'border-gray-200',
        iconColor: 'gray',
        statusColor: 'gray',
        statusText: 'Offline',
        powerColor: 'gray'
      };
    }
  };

  const theme = getCardTheme();

  return (
    <View className={cn(
      'rounded-3xl overflow-hidden shadow-sm',
      theme.background,
      isSelected ? 'border-2 border-black/40' : theme.border,
      'border',
      isOptimistic && 'opacity-70'
    )}>
      {/* Top colored bar */}
      <View
        className={cn('h-[6px] mx-20 mt-4 rounded-full border border-slate-400', theme.topBar)}
        style={{
          // React Native shadow (iOS)
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          // Android shadow
          elevation: 2,
        }}
      />
      
      {/* Header Section */}
      <View className="p-6">
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            {/* Icon and Title */}
            <View className="flex-row items-center mb-3">
              <View className="rotate-180 mr-3">
                <HugeiconsIcon 
                  icon={BreastPumpIcon} 
                  size={35} 
                  color={theme.iconColor} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-lg mb-1">
                  {valve.name}
                </Text>
                <Text className="text-slate-600 text-sm">
                  APC-20N-02
                </Text>
              </View>
            </View>

            {/* Status and Location */}
            <View className="flex-row items-center mb-2">
              <View className={cn(
                'w-2 h-2 rounded-full mr-2',
                theme.statusColor === 'green' ? 'bg-green-500' : 
                theme.statusColor === 'red' ? 'bg-red-500' : 'bg-gray-500'
              )} />
              <Text className={cn(
                'text-sm font-medium',
                theme.statusColor === 'green' ? 'text-green-600' : 
                theme.statusColor === 'red' ? 'text-red-600' : 'text-gray-600'
              )}>
                {theme.statusText}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              {/* Location */}
              <View className="flex-row items-center">
                <MapPin size={24} color="gray" />
                <Text className="text-gray-600 text-sm ml-1">
                  {valve.location || 'North Side, Sector 1'}
                </Text>
              </View>
              {/* Power Button */}
                        <TouchableOpacity
              onPress={() => handleToggle(!valve.isOpen)}
              disabled={!valve.isOnline}
              className={cn(
                'w-10 h-10 rounded-full items-center justify-center',
                theme.powerColor === 'green' ? 'text-green-500' : 'text-gray-400',
                !valve.isOnline && 'opacity-50'
              )}
                        >
              <CirclePower size={24} />
                        </TouchableOpacity>
            </View>

          </View>

          
        </View>

        {/* Separator */}
        <View className={cn('h-px mb-4 border-t border-slate-300')} />

        {/* Metrics Section */}
        <View className="flex-row justify-between opacity-70">
          {/* Percentage */}
          <View className="flex-1 items-center">
          <CircleGaugeIcon size={24} color="black" />
            <Text className={cn(
              'text-sm font-medium mt-1',
              valve.isOnline ? 'text-black' : 'text-gray-500'
            )}>
              {valve.isOnline ? `${valve.percentage}%` : '0%'}
            </Text>
          </View>

          {/* Pressure */}
          <View className="flex-1 items-center">
            <Gauge size={24} color="black" />
            <Text className={cn(
              'text-sm font-medium mt-1',
              valve.isOnline && valve.pressure ? 'text-black' : 'text-gray-500'
            )}>
              {valve.isOnline && valve.pressure ? `${valve.pressure} PSI` : '- PSI'}
            </Text>
          </View>

          {/* Flow Rate */}
          <View className="flex-1 items-center">
            <Droplets size={24} color="black" />
            <Text className={cn(
              'text-sm font-medium mt-1',
              valve.isOnline && valve.flowRate ? 'text-black' : 'text-gray-500'
            )}>
              {valve.isOnline && valve.flowRate ? `${valve.flowRate} L/min` : '- L/min'}
            </Text>
          </View>
        </View>
      </View>

      {/* Alert Message */}
      {valve.hasAlert && valve.alertMessage && (
        <View className="mx-6 mb-4 bg-red-100 border border-red-200 rounded-lg p-3">
          <Text className="text-red-700 text-sm">{valve.alertMessage}</Text>
        </View>
      )}

      {/* Optimistic State */}
      {isOptimistic && (
        <View className="mx-6 mb-4 bg-yellow-100 border border-yellow-200 rounded-lg p-2">
          <Text className="text-yellow-700 text-xs text-center">
            Command queued - waiting for connection
          </Text>
        </View>
      )}
    </View>
  );
}
