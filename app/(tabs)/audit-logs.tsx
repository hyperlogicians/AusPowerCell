import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { 
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Filter,
  Download,
  Search,
  Calendar,
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
    timestamp: new Date(),
    user: 'John Smith',
    action: 'Emergency Shutdown Activated',
    target: 'All Systems',
    result: 'success',
    details: 'Emergency protocol triggered - all valves closed safely',
    ipAddress: '192.168.1.105',
    location: 'Control Room A',
    severity: 'critical'
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
    timestamp: new Date(Date.now() - 1200000),
    user: 'Emily Chen',
    action: 'User Login',
    target: 'System Access',
    result: 'success',
    details: 'Successful authentication from mobile device',
    ipAddress: '192.168.1.115',
    location: 'Remote Access',
    severity: 'low'
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
      case 'success': return <CheckCircle size={16} color="#10b981" />;
      case 'failed': return <XCircle size={16} color="#ef4444" />;
      case 'pending': return <Clock size={16} color="#f59e0b" />;
      default: return <Activity size={16} color="#64748b" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-slate-100 bg-white';
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
        'px-4 py-2 rounded-xl border transition-all duration-200',
        filter === type 
          ? 'bg-blue-500 border-blue-500' 
          : 'bg-white border-slate-200'
      )}
    >
      <View className="flex-row items-center">
        <Text className={cn(
          'font-medium text-sm',
          filter === type ? 'text-white' : 'text-slate-700'
        )}>
          {label}
        </Text>
        <View className={cn(
          'ml-2 px-2 py-0.5 rounded-full',
          filter === type ? 'bg-white/20' : 'bg-slate-100'
        )}>
          <Text className={cn(
            'text-xs font-semibold',
            filter === type ? 'text-white' : 'text-slate-600'
          )}>
            {count}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const LogItem = ({ log, isLast }: { log: AuditLog; isLast?: boolean }) => (
    <View className="flex-row">
      {/* Timeline */}
      <View className="items-center mr-4">
        <View className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 items-center justify-center">
          {getActionIcon(log.action)}
        </View>
        {!isLast && <View className="w-0.5 bg-slate-200 flex-1 mt-2" />}
      </View>

      {/* Content */}
      <View className="flex-1 pb-6">
        <Card variant="subtle" size="md" className={cn("border", getSeverityColor(log.severity))}>
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                {getResultIcon(log.result)}
                <Text className="text-slate-900 font-semibold text-base ml-2">{log.action}</Text>
              </View>
              <Text className="text-slate-600 text-sm mb-1">{log.target}</Text>
              <Text className="text-slate-500 text-sm">{log.details}</Text>
            </View>
            <Pressable className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center">
              <MoreHorizontal size={16} color="#64748b" />
            </Pressable>
          </View>

          <View className="border-t border-slate-100 pt-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <User size={14} color="#64748b" />
                <Text className="text-slate-600 text-sm ml-1">{log.user}</Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={14} color="#64748b" />
                <Text className="text-slate-600 text-sm ml-1">
                  {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
            {log.location && (
              <View className="flex-row items-center mt-2">
                <MapPin size={14} color="#64748b" />
                <Text className="text-slate-600 text-sm ml-1">{log.location}</Text>
                <Text className="text-slate-400 text-sm ml-2">• {log.ipAddress}</Text>
              </View>
            )}
          </View>
        </Card>
      </View>
    </View>
  );

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
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-1">
              <Text className="text-slate-900 text-3xl font-bold mb-2">
                Audit Trail
              </Text>
              <Text className="text-slate-600 text-base">
                Track all system activities and user actions
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <Pressable className="w-12 h-12 rounded-2xl bg-white border border-slate-200 items-center justify-center">
                <Search size={20} color="#64748b" />
              </Pressable>
              <Pressable className="w-12 h-12 rounded-2xl bg-white border border-slate-200 items-center justify-center">
                <Download size={20} color="#64748b" />
              </Pressable>
            </View>
            </View>

          {/* Stats Row */}
          <View className="flex-row space-x-4 mb-6">
            <Card variant="subtle" size="sm" className="flex-1 bg-white border border-slate-100">
              <View className="items-center">
                <Text className="text-2xl font-bold text-slate-900">{mockLogs.length}</Text>
                <Text className="text-slate-600 text-sm">Total Events</Text>
              </View>
            </Card>
            <Card variant="subtle" size="sm" className="flex-1 bg-white border border-slate-100">
              <View className="items-center">
                <Text className="text-2xl font-bold text-emerald-600">
                  {mockLogs.filter(l => l.result === 'success').length}
                    </Text>
                <Text className="text-slate-600 text-sm">Successful</Text>
              </View>
            </Card>
            <Card variant="subtle" size="sm" className="flex-1 bg-white border border-slate-100">
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-600">
                  {mockLogs.filter(l => l.severity === 'critical').length}
                    </Text>
                <Text className="text-slate-600 text-sm">Critical</Text>
              </View>
            </Card>
          </View>

          {/* Filters */}
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-3">
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
                type="pending" 
                label="Pending" 
                count={mockLogs.filter(l => l.result === 'pending').length}
              />
              <FilterButton 
                type="critical" 
                label="Critical" 
                count={mockLogs.filter(l => l.severity === 'critical').length}
              />
            </ScrollView>
          </View>

          {/* Timeline */}
            <View>
            <Text className="text-slate-900 text-xl font-semibold mb-6">
                Activity Timeline ({filteredLogs.length})
              </Text>
              
              {filteredLogs.length === 0 ? (
              <Card variant="subtle" size="lg" className="bg-white border border-slate-100">
                <View className="items-center py-8">
                  <Eye size={48} color="#94a3b8" />
                  <Text className="text-slate-500 text-lg font-medium mt-4">No events found</Text>
                  <Text className="text-slate-400 text-sm">Try adjusting your filters</Text>
                </View>
                </Card>
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