import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { 
  Users,
  UserPlus,
  Shield,
  Eye,
  Settings,
  Activity,
  Clock,
  MapPin,
  Mail,
  Phone,
  MoreVertical,
  Search,
  Filter,
  Crown,
  Wrench,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  department: string;
  lastLogin: Date;
  isOnline: boolean;
  actionsToday: number;
  totalActions: number;
  avatar?: string;
  location?: string;
  permissions: string[];
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@apc.com',
    role: 'admin',
    department: 'Operations',
    lastLogin: new Date(Date.now() - 300000),
    isOnline: true,
    actionsToday: 24,
    totalActions: 1547,
    location: 'Control Room A',
    permissions: ['all_access', 'emergency_stop', 'user_management']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@apc.com',
    role: 'operator',
    department: 'Field Operations',
    lastLogin: new Date(Date.now() - 1800000),
    isOnline: true,
    actionsToday: 18,
    totalActions: 892,
    location: 'Field Station 1',
    permissions: ['valve_control', 'monitoring']
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@apc.com',
    role: 'operator',
    department: 'Maintenance',
    lastLogin: new Date(Date.now() - 3600000),
    isOnline: false,
    actionsToday: 7,
    totalActions: 634,
    location: 'Field Station 2',
    permissions: ['maintenance', 'monitoring']
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@apc.com',
    role: 'viewer',
    department: 'Quality Assurance',
    lastLogin: new Date(Date.now() - 7200000),
    isOnline: false,
    actionsToday: 0,
    totalActions: 156,
    permissions: ['monitoring']
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@apc.com',
    role: 'admin',
    department: 'IT Administration',
    lastLogin: new Date(Date.now() - 86400000),
    isOnline: false,
    actionsToday: 0,
    totalActions: 2341,
    permissions: ['all_access', 'system_config', 'user_management']
  }
];

type FilterType = 'all' | 'online' | 'admin' | 'operator' | 'viewer';

export default function UsersPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const filteredUsers = mockUsers.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'online') return user.isOnline;
    return user.role === filter;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown size={16} color="#dc2626" />;
      case 'operator': return <Wrench size={16} color="#2563eb" />;
      case 'viewer': return <Eye size={16} color="#64748b" />;
      default: return <Users size={16} color="#64748b" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-50 border-red-200 text-red-700';
      case 'operator': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'viewer': return 'bg-slate-50 border-slate-200 text-slate-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getLastLoginText = (lastLogin: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
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

  const UserCard = ({ user }: { user: User }) => (
    <Card variant="subtle" size="lg" className="bg-white border border-slate-100 mb-4">
      <View className="flex-row items-start">
        {/* Avatar */}
        <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-200 items-center justify-center mr-4">
          <Text className="text-slate-700 font-semibold text-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>

        {/* User Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-900 font-semibold text-lg">{user.name}</Text>
            <View className="flex-row items-center">
              <View className={`w-2 h-2 rounded-full mr-2 ${
                user.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
              }`} />
              <Text className="text-slate-500 text-sm">
                {user.isOnline ? 'Online' : 'Offline'}
              </Text>
              <Pressable className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center ml-2">
                <MoreVertical size={16} color="#64748b" />
              </Pressable>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <Mail size={14} color="#64748b" />
            <Text className="text-slate-600 text-sm ml-2">{user.email}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className={`px-3 py-1 rounded-full border ${getRoleColor(user.role)}`}>
                <View className="flex-row items-center">
                  {getRoleIcon(user.role)}
                  <Text className="text-xs font-semibold ml-1 capitalize">{user.role}</Text>
                </View>
              </View>
              <Text className="text-slate-500 text-sm ml-3">{user.department}</Text>
            </View>
          </View>

          {user.location && (
            <View className="flex-row items-center mb-3">
              <MapPin size={14} color="#64748b" />
              <Text className="text-slate-600 text-sm ml-2">{user.location}</Text>
            </View>
          )}

          <View className="border-t border-slate-100 pt-4">
            <View className="flex-row justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Clock size={14} color="#64748b" />
                  <Text className="text-slate-500 text-xs ml-1">Last Login</Text>
                </View>
                <Text className="text-slate-900 font-semibold text-sm">
                  {getLastLoginText(user.lastLogin)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <View className="flex-row items-center mb-1">
                  <Activity size={14} color="#64748b" />
                  <Text className="text-slate-500 text-xs ml-1">Today</Text>
                </View>
                <Text className="text-slate-900 font-semibold text-sm">
                  {user.actionsToday} actions
                </Text>
              </View>
              <View className="flex-1 items-end">
                <View className="flex-row items-center mb-1">
                  <Zap size={14} color="#64748b" />
                  <Text className="text-slate-500 text-xs ml-1">Total</Text>
                </View>
                <Text className="text-slate-900 font-semibold text-sm">
                  {user.totalActions.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  const onlineUsers = mockUsers.filter(u => u.isOnline).length;
  const totalActions = mockUsers.reduce((sum, u) => sum + u.actionsToday, 0);
  const adminCount = mockUsers.filter(u => u.role === 'admin').length;

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
                Team Management
              </Text>
              <Text className="text-slate-600 text-base">
                Manage user access and monitor team activity
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <Pressable className="w-12 h-12 rounded-2xl bg-white border border-slate-200 items-center justify-center">
                <Search size={20} color="#64748b" />
              </Pressable>
              <Pressable className="w-12 h-12 rounded-2xl bg-blue-500 items-center justify-center">
                <UserPlus size={20} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Stats Grid */}
          <View className={`mb-8 ${isTablet ? 'flex-row space-x-4' : 'space-y-4'}`}>
            <Card variant="subtle" size="lg" className="flex-1 bg-white border border-slate-100">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 items-center justify-center mr-4">
                  <CheckCircle size={24} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-500 text-sm">Active Users</Text>
                  <Text className="text-slate-900 text-2xl font-bold">{onlineUsers}</Text>
                  <Text className="text-emerald-600 text-sm">Currently online</Text>
                </View>
              </View>
            </Card>

            <Card variant="subtle" size="lg" className="flex-1 bg-white border border-slate-100">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 items-center justify-center mr-4">
                  <Activity size={24} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-500 text-sm">Actions Today</Text>
                  <Text className="text-slate-900 text-2xl font-bold">{totalActions}</Text>
                  <Text className="text-blue-600 text-sm">System interactions</Text>
                </View>
              </View>
            </Card>

            {isTablet && (
              <Card variant="subtle" size="lg" className="flex-1 bg-white border border-slate-100">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 items-center justify-center mr-4">
                    <Shield size={24} color="#dc2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-500 text-sm">Administrators</Text>
                    <Text className="text-slate-900 text-2xl font-bold">{adminCount}</Text>
                    <Text className="text-red-600 text-sm">Full access users</Text>
                  </View>
                </View>
              </Card>
            )}
          </View>

          {/* Filters */}
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-3">
              <FilterButton 
                type="all" 
                label="All Users" 
                count={mockUsers.length}
              />
              <FilterButton 
                type="online" 
                label="Online" 
                count={onlineUsers}
              />
              <FilterButton 
                type="admin" 
                label="Admins" 
                count={adminCount}
              />
              <FilterButton 
                type="operator" 
                label="Operators" 
                count={mockUsers.filter(u => u.role === 'operator').length}
              />
              <FilterButton 
                type="viewer" 
                label="Viewers" 
                count={mockUsers.filter(u => u.role === 'viewer').length}
              />
            </ScrollView>
          </View>

          {/* Users List */}
          <View>
            <Text className="text-slate-900 text-xl font-semibold mb-6">
              Team Members ({filteredUsers.length})
            </Text>
            
            <View className={isTablet ? 'flex-row flex-wrap -mx-2' : ''}>
              {filteredUsers.map(user => (
                <View key={user.id} className={isTablet ? 'w-1/2 px-2' : ''}>
                  <UserCard user={user} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}