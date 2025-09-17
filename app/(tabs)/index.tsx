import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, useWindowDimensions, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { 
  Activity, 
  Zap, 
  Gauge, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Settings,
  Play,
  Pause,
  MoreVertical,
  Droplets,
  Thermometer,
  BarChart3
} from 'lucide-react-native';

interface SystemStats {
  totalValves: number;
  onlineValves: number;
  activeValves: number;
  alerts: number;
  avgPressure: number;
  temperature: number;
}

interface ValveData {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  isActive: boolean;
  pressure: number;
  flow: number;
  lastUpdate: Date;
  hasAlert?: boolean;
}

const mockStats: SystemStats = {
  totalValves: 12,
  onlineValves: 11,
  activeValves: 8,
  alerts: 2,
  avgPressure: 45.2,
  temperature: 72.5
};

const mockValves: ValveData[] = [
  { id: '1', name: 'Main Supply', status: 'online', isActive: true, pressure: 52.1, flow: 85, lastUpdate: new Date(), hasAlert: false },
  { id: '2', name: 'Secondary A', status: 'offline', isActive: false, pressure: 0, flow: 0, lastUpdate: new Date(Date.now() - 300000), hasAlert: true },
  { id: '3', name: 'Secondary B', status: 'online', isActive: true, pressure: 48.3, flow: 72, lastUpdate: new Date() },
  { id: '4', name: 'Emergency', status: 'online', isActive: false, pressure: 0, flow: 0, lastUpdate: new Date() },
  { id: '5', name: 'Backup Line', status: 'maintenance', isActive: false, pressure: 0, flow: 0, lastUpdate: new Date(Date.now() - 600000) },
  { id: '6', name: 'Pressure Relief', status: 'online', isActive: true, pressure: 38.7, flow: 45, lastUpdate: new Date(), hasAlert: true }
];

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: 'up' | 'down';
    color?: 'blue' | 'green' | 'red' | 'orange';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-100 text-blue-600',
      green: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      red: 'bg-red-50 border-red-100 text-red-600',
      orange: 'bg-orange-50 border-orange-100 text-orange-600'
    };

    return (
      <Card variant="subtle" size="lg" className="bg-white border border-slate-100">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-3">
              <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${colorClasses[color]}`}>
                <Icon size={24} color="currentColor" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-medium">{title}</Text>
                <Text className="text-slate-900 text-2xl font-bold">{value}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              {trend && (
                <View className={`flex-row items-center mr-2 ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  <TrendingUp size={14} color="currentColor" className={trend === 'down' ? 'rotate-180' : ''} />
                </View>
              )}
              <Text className="text-slate-600 text-sm">{subtitle}</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const ValveCard = ({ valve }: { valve: ValveData }) => {
    const statusColors = {
      online: 'bg-emerald-500',
      offline: 'bg-red-500',
      maintenance: 'bg-orange-500'
    };

    return (
      <Card variant="subtle" size="md" className={cn(
        "bg-white border",
        valve.hasAlert ? "border-red-200" : "border-slate-100"
      )}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-slate-900 font-semibold text-lg">{valve.name}</Text>
            <View className="flex-row items-center mt-1">
              <View className={`w-2 h-2 rounded-full mr-2 ${statusColors[valve.status]}`} />
              <Text className="text-slate-600 text-sm capitalize">{valve.status}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Pressable className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center mr-2">
              {valve.isActive ? 
                <Pause size={16} color="#64748b" /> : 
                <Play size={16} color="#64748b" />
              }
            </Pressable>
            <Pressable className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center">
              <MoreVertical size={16} color="#64748b" />
            </Pressable>
          </View>
        </View>

        <View className="border-t border-slate-100 pt-3">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Gauge size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1">Pressure</Text>
              </View>
              <Text className="text-slate-900 font-semibold">{valve.pressure} PSI</Text>
            </View>
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Droplets size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1">Flow</Text>
              </View>
              <Text className="text-slate-900 font-semibold">{valve.flow}%</Text>
            </View>
          </View>
        </View>

        {valve.hasAlert && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-2 mt-3">
            <View className="flex-row items-center">
              <AlertTriangle size={14} color="#dc2626" />
              <Text className="text-red-700 text-xs ml-2">System alert detected</Text>
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#64748b"
            colors={['#64748b']}
          />
        }
      >
        <View className="py-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-slate-900 text-3xl font-bold mb-2">
              System Overview
            </Text>
            <Text className="text-slate-600 text-base">
              Monitor and control your valve infrastructure
            </Text>
          </View>

          {/* Stats Grid */}
          <View className={`mb-8 ${isTablet ? 'flex-row flex-wrap -mx-2' : 'space-y-4'}`}>
            <View className={isTablet ? 'w-1/2 px-2 mb-4' : ''}>
              <StatCard
                icon={CheckCircle}
                title="Online Systems"
                value={mockStats.onlineValves}
                subtitle={`${mockStats.totalValves} total systems`}
                color="green"
                trend="up"
              />
            </View>
            <View className={isTablet ? 'w-1/2 px-2 mb-4' : ''}>
              <StatCard
                icon={Activity}
                title="Active Valves"
                value={mockStats.activeValves}
                subtitle="Currently operating"
                color="blue"
              />
            </View>
            <View className={isTablet ? 'w-1/2 px-2 mb-4' : ''}>
              <StatCard
                icon={Thermometer}
                title="Temperature"
                value={`${mockStats.temperature}°F`}
                subtitle="System average"
                color="orange"
              />
            </View>
            <View className={isTablet ? 'w-1/2 px-2 mb-4' : ''}>
              <StatCard
                icon={AlertTriangle}
                title="Active Alerts"
                value={mockStats.alerts}
                subtitle="Require attention"
                color="red"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-slate-900 text-xl font-semibold mb-4">Quick Actions</Text>
            <View className="flex-row space-x-3">
              <Pressable className="flex-1 bg-blue-500 rounded-2xl p-4 items-center">
                <Zap size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Emergency Stop</Text>
              </Pressable>
              <Pressable className="flex-1 bg-emerald-500 rounded-2xl p-4 items-center">
                <Settings size={24} color="white" />
                <Text className="text-white font-semibold mt-2">System Check</Text>
              </Pressable>
              <Pressable className="flex-1 bg-orange-500 rounded-2xl p-4 items-center">
                <BarChart3 size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Reports</Text>
              </Pressable>
            </View>
          </View>

          {/* Valves Grid */}
          <View>
            <Text className="text-slate-900 text-xl font-semibold mb-4">
              Valve Status ({mockValves.length})
            </Text>
            <View className={isTablet ? 'flex-row flex-wrap -mx-2' : 'space-y-4'}>
              {mockValves.map(valve => (
                <View key={valve.id} className={isTablet ? 'w-1/2 px-2 mb-4' : ''}>
                  <ValveCard valve={valve} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}