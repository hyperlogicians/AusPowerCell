import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { 
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  MapPin,
  Zap,
  Settings,
  Eye,
  MoreHorizontal
} from 'lucide-react-native';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  target: string;
  result: 'success' | 'failed' | 'pending';
  details: string;
  ipAddress: string;
  location?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const mockLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1200000),
    user: 'Emily Chen',
    action: 'User Login',
    target: 'System Access',
    result: 'success',
    details: 'Successful authentication from mobile device',
    ipAddress: '192.168.1.115',
    location: 'Remote Access',
    severity: 'low'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 300000),
    user: 'Sarah Johnson',
    action: 'Valve Configuration Updated',
    target: 'Main Supply Valve',
    result: 'success',
    details: 'Pressure threshold adjusted to 55 PSI',
    ipAddress: '192.168.1.102',
    location: 'Field Station 1',
    severity: 'medium'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 600000),
    user: 'Mike Davis',
    action: 'System Maintenance',
    target: 'Secondary Line A',
    result: 'failed',
    details: 'Device offline - maintenance could not be completed',
    ipAddress: '192.168.1.108',
    location: 'Field Station 2',
    severity: 'high'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 900000),
    user: 'System',
    action: 'Automatic Pressure Adjustment',
    target: 'Pressure Relief Valve',
    result: 'pending',
    details: 'Auto-adjustment in progress based on sensor readings',
    ipAddress: 'System',
    severity: 'low'
  },
  {
    id: '5',
    timestamp: new Date(),
    user: 'John Smith',
    action: 'Emergency Shutdown Activated',
    target: 'All Systems',
    result: 'success',
    details: 'Emergency protocol triggered - all valves closed safely',
    ipAddress: '192.168.1.105',
    location: 'Control Room A',
    severity: 'critical'
  }
];

type FilterType = 'all' | 'success' | 'failed' | 'pending' | 'critical';

export default function AuditLogs() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const filteredLogs = mockLogs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'critical') return log.severity === 'critical';
    return log.result === filter;
  });

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle size={20} color="#10b981" />;
      case 'failed': return <XCircle size={20} color="#ef4444" />;
      case 'pending': return <Clock size={20} color="#f59e0b" />;
      default: return <Activity size={20} color="#64748b" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Emergency')) return <AlertTriangle size={20} color="#ef4444" />;
    if (action.includes('Login')) return <User size={20} color="#64748b" />;
    if (action.includes('Configuration')) return <Settings size={20} color="#3b82f6" />;
    if (action.includes('Maintenance')) return <Zap size={20} color="#f59e0b" />;
    return <Activity size={20} color="#64748b" />;
  };

  const FilterButton = ({ type, label, count }: { type: FilterType; label: string; count: number }) => (
    <Pressable
      onPress={() => setFilter(type)}
      className={cn(
        'px-6 py-3 rounded-full border-2 transition-all duration-200',
        filter === type 
          ? 'bg-blue-500 border-blue-500' 
          : 'bg-white border-slate-300'
      )}
    >
      <View className="flex-row items-center justify-center">
        <Text className={cn(
          'font-semibold text-base',
          filter === type ? 'text-white' : 'text-slate-900'
        )}>
          {label}
        </Text>
        <Text className={cn(
          'ml-2 font-bold text-base',
          filter === type ? 'text-white' : 'text-slate-700'
        )}>
          {count}
        </Text>
      </View>
    </Pressable>
  );

  const LogItem = ({ log, isFirst }: { log: AuditLog; isFirst?: boolean }) => (
    <View className="flex-row mb-4">
      {/* Timeline */}
      <View className="items-center mr-5">
        <View className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 items-center justify-center shadow-sm">
          {getActionIcon(log.action)}
        </View>
        {!isFirst && <View className="w-1 bg-slate-300 flex-1 mt-1" />}
      </View>

      {/* Content */}
      <View className="flex-1 pb-6">
        <View className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <View className="flex-row items-center mb-3">
                {getResultIcon(log.result)}
                <Text className="text-slate-900 font-bold text-base ml-3">{log.action}</Text>
              </View>
              <Text className="text-slate-600 font-medium text-sm mb-1">{log.target}</Text>
              <Text className="text-slate-500 text-sm">{log.details}</Text>
            </View>
            <Pressable className="w-8 h-8 rounded-lg items-center justify-center ml-2">
              <MoreHorizontal size={18} color="#94a3b8" />
            </Pressable>
          </View>

          <View className="border-t border-slate-200 pt-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <User size={16} color="#64748b" />
                <Text className="text-slate-600 font-medium text-sm ml-2">{log.user}</Text>
              </View>
              <Text className="text-slate-600 font-medium text-sm">
                {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            {log.location && (
              <View className="flex-row items-center">
                <MapPin size={16} color="#64748b" />
                <Text className="text-slate-600 font-medium text-sm ml-2">{log.location}</Text>
                <Text className="text-slate-400 text-sm ml-2">• {log.ipAddress}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView
        className="flex-1 px-8"
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
        <View className="py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-slate-900 text-4xl font-bold mb-2">
              Audit Logs
            </Text>
            <Text className="text-slate-600 text-base font-medium">
              Track all system activities and user actions
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row space-x-4 mb-8">
            <View className="flex-1 bg-white rounded-2xl border border-slate-200 px-6 py-6 items-center shadow-sm">
              <Text className="text-slate-900 text-4xl font-bold">{mockLogs.length}</Text>
              <Text className="text-slate-600 font-medium text-sm mt-2">Total events</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl border border-slate-200 px-6 py-6 items-center shadow-sm">
              <Text className="text-emerald-600 text-4xl font-bold">
                {mockLogs.filter(l => l.result === 'success').length}
              </Text>
              <Text className="text-slate-600 font-medium text-sm mt-2">Successful</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl border border-slate-200 px-6 py-6 items-center shadow-sm">
              <Text className="text-red-600 text-4xl font-bold">
                {mockLogs.filter(l => l.severity === 'critical').length}
              </Text>
              <Text className="text-slate-600 font-medium text-sm mt-2">Critical</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl border border-slate-200 px-6 py-6 items-center shadow-sm">
              <Text className="text-slate-900 text-4xl font-bold">
                {mockLogs.filter(l => l.result === 'failed').length}
              </Text>
              <Text className="text-slate-600 font-medium text-sm mt-2">Failed</Text>
            </View>
          </View>

          {/* Filters */}
          <View className="mb-8">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
              <FilterButton 
                type="all" 
                label="All Events" 
                count={mockLogs.length}
              />
              <FilterButton 
                type="success" 
                label="Success" 
                count={mockLogs.filter(l => l.result === 'success').length}
              />
              <FilterButton 
                type="failed" 
                label="Failed" 
                count={mockLogs.filter(l => l.result === 'failed').length}
              />
              <FilterButton 
                type="critical" 
                label="Critical" 
                count={mockLogs.filter(l => l.severity === 'critical').length}
              />
              <FilterButton 
                type="pending" 
                label="Pending" 
                count={mockLogs.filter(l => l.result === 'pending').length}
              />
            </ScrollView>
          </View>

          {/* Timeline */}
          <View>
            <Text className="text-slate-900 text-2xl font-bold mb-6">
              Activity Timeline
            </Text>
            
            {filteredLogs.length === 0 ? (
              <View className="bg-white rounded-2xl border border-slate-200 px-6 py-12 items-center shadow-sm">
                <Eye size={48} color="#94a3b8" />
                <Text className="text-slate-500 text-lg font-bold mt-4">No events found</Text>
                <Text className="text-slate-400 text-sm">Try adjusting your filters</Text>
              </View>
            ) : (
              <View>
                {filteredLogs.map((log, index) => (
                  <LogItem
                    key={log.id}
                    log={log}
                    isFirst={index === 0}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}