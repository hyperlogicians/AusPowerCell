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
      case 'success': return <CheckCircle size={18} color="#10b981" />;
      case 'failed': return <XCircle size={18} color="#ef4444" />;
      case 'pending': return <Clock size={18} color="#f59e0b" />;
      default: return <Activity size={18} color="#64748b" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Emergency')) return <AlertTriangle size={18} color="#ef4444" />;
    if (action.includes('Login')) return <User size={18} color="#64748b" />;
    if (action.includes('Configuration')) return <Settings size={18} color="#3b82f6" />;
    if (action.includes('Maintenance')) return <Zap size={18} color="#f59e0b" />;
    return <Activity size={18} color="#64748b" />;
  };

  const FilterButton = ({ type, label, count }: { type: FilterType; label: string; count: number }) => (
    <Pressable
      onPress={() => setFilter(type)}
      className={cn(
        'px-4 py-2 rounded-2xl mr-3',
        filter === type 
          ? 'bg-[#5B8A9E]' 
          : 'bg-white border border-[#cbd5e1]'
      )}
    >
      <Text className={cn(
        'font-medium text-sm',
        filter === type ? 'text-white' : 'text-[#334155]'
      )}>
        {label} {count}
      </Text>
    </Pressable>
  );

  const LogItem = ({ log, isLast }: { log: AuditLog; isLast?: boolean }) => (
    <View className="flex-row">
      {/* Timeline Circle and Line */}
      <View className="items-center mr-4" style={{ width: 40 }}>
        <View className="w-10 h-10 rounded-full bg-white border-2 border-[#b4b4b4] items-center justify-center">
          {getActionIcon(log.action)}
        </View>
        {!isLast && (
          <View className="w-[1.5px] flex-1 bg-[#d4d4d4]" style={{ minHeight: 80 }} />
        )}
      </View>

      {/* Content Card */}
      <View className="flex-1 mb-6">
        <View className="bg-white rounded-3xl border-2 border-[#b4b4b4] p-4">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-2">
              <View className="flex-row items-center mb-2">
                {getResultIcon(log.result)}
                <Text className="text-[#1e293b] font-semibold text-base ml-2">{log.action}</Text>
              </View>
              <Text className="text-[#475569] text-sm font-medium mb-1">{log.target}</Text>
              <Text className="text-[#64748b] text-sm">{log.details}</Text>
            </View>
            <Pressable className="w-6 h-6 items-center justify-center">
              <MoreHorizontal size={16} color="#94a3b8" />
            </Pressable>
          </View>

          <View className="border-t border-[#f1f5f9] pt-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <User size={14} color="#64748b" />
                <Text className="text-[#475569] text-xs font-medium ml-1.5">{log.user}</Text>
              </View>
              <Text className="text-[#64748b] text-xs">
                {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            {log.location && (
              <View className="flex-row items-center">
                <MapPin size={14} color="#64748b" />
                <Text className="text-[#475569] text-xs ml-1.5">{log.location}</Text>
                <Text className="text-[#94a3b8] text-xs ml-1.5">• {log.ipAddress}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
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
        <View className="py-10">
          {/* Header with Stats */}
          <View className="flex-row items-start justify-between mb-6">
            {/* Title Section */}
            <View className="flex-1">
                <Text className="text-slate-900 text-3xl mb-1">
                  Audit Logs
                </Text>
                <Text className="text-slate-600 text-base">
                  Track all system activities and user actions
                </Text>
              </View>

            {/* Stats Boxes */}
            <View className="flex-row ml-8">
              <View className="bg-white rounded-2xl border border-[#9ea2a7] px-4 py-3 mr-4 flex-col justify-between" style={{ minWidth: 140 }}>
                <Text className="text-[#0f172a] text-5xl text-left">{mockLogs.length}</Text>
                <Text className="text-[#414a58] text-xs mt-2 text-right">Total events</Text>
              </View>
              <View className="bg-white rounded-2xl border border-[#9ea2a7] px-4 py-3 mr-4 flex-col justify-between" style={{ minWidth: 140 }}>
                <Text className="text-[#2f9b77] text-5xl text-left">
                  {mockLogs.filter(l => l.result === 'success').length}
                </Text>
                <Text className="text-[#414a58] text-xs mt-2 text-right">Successful</Text>
              </View>
              <View className="bg-white rounded-2xl border border-[#9ea2a7] px-4 py-3 mr-4 flex-col justify-between" style={{ minWidth: 140 }}>
                <Text className="text-[#b73434] text-5xl text-left">
                  {mockLogs.filter(l => l.severity === 'critical').length}
                </Text>
                <Text className="text-[#414a58] text-xs mt-2 text-right">Critical</Text>
              </View>
              <View className="bg-white rounded-2xl border border-[#9ea2a7] px-4 py-3 flex-col justify-between" style={{ minWidth: 140 }}>
                <Text className="text-[#0f172a] text-5xl text-left">
                  {mockLogs.filter(l => l.result === 'failed').length}
                </Text>
                <Text className="text-[#414a58] text-xs mt-2 text-right">Failed</Text>
              </View>
            </View>
          </View>

          {/* Filters */}
          <View className="mb-8">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
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
              </View>
            </ScrollView>
          </View>

          {/* Activity Timeline */}
          <View>
            <Text className="text-[#0f172a] text-xl font-medium mb-6">
              Activity Timeline
            </Text>
            
            {filteredLogs.length === 0 ? (
              <View className="bg-white rounded-2xl border border-[#e2e8f0] px-6 py-16 items-center">
                <Eye size={48} color="#94a3b8" />
                <Text className="text-[#64748b] text-lg font-semibold mt-4">No events found</Text>
                <Text className="text-[#94a3b8] text-sm mt-1">Try adjusting your filters</Text>
              </View>
            ) : (
              <View>
                {filteredLogs.map((log, index) => (
                  <LogItem
                    key={log.id}
                    log={log}
                    isLast={index === filteredLogs.length - 1}
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