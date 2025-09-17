import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  HardDrive,
  Wifi,
  Battery,
  Monitor,
  Volume2,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Key,
  Users,
  Activity,
  AlertTriangle,
  Info,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ChevronRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'button' | 'info' | 'navigation';
  value?: boolean;
  icon: any;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  description?: string;
  items: SettingItem[];
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const buzz = (intensity: 'light' | 'medium' = 'light') => {
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      const style = intensity === 'light' 
        ? Haptics.ImpactFeedbackStyle.Light 
        : Haptics.ImpactFeedbackStyle.Medium;
      Haptics.impactAsync(style);
    }
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Notifications',
      description: 'Manage how you receive alerts and updates',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          description: 'Receive system alerts and updates',
          type: 'toggle',
          value: notifications,
          icon: Bell,
          color: 'blue',
          onToggle: (value) => {
            buzz();
            setNotifications(value);
          }
        },
        {
          id: 'emergency-alerts',
          title: 'Emergency Alerts',
          description: 'Critical system notifications',
          type: 'toggle',
          value: emergencyAlerts,
          icon: AlertTriangle,
          color: 'red',
          onToggle: (value) => {
            buzz();
            setEmergencyAlerts(value);
          }
        },
        {
          id: 'sound-alerts',
          title: 'Sound Alerts',
          description: 'Audio notifications for events',
          type: 'toggle',
          value: soundEnabled,
          icon: Volume2,
          color: 'green',
          onToggle: (value) => {
            buzz();
            setSoundEnabled(value);
          }
        }
      ]
    },
    {
      title: 'Security',
      description: 'Protect your account and data',
      items: [
        {
          id: 'biometric-auth',
          title: 'Biometric Authentication',
          description: 'Use fingerprint or face recognition',
          type: 'toggle',
          value: biometricAuth,
          icon: Key,
          color: 'purple',
          onToggle: (value) => {
            buzz();
            setBiometricAuth(value);
          }
        },
        {
          id: 'change-password',
          title: 'Change Password',
          description: 'Update your account password',
          type: 'navigation',
          icon: Lock,
          color: 'blue',
          onPress: () => buzz('medium')
        },
        {
          id: 'two-factor',
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          type: 'navigation',
          icon: Shield,
          color: 'green',
          onPress: () => buzz('medium')
        }
      ]
    },
    {
      title: 'System',
      description: 'Configure system behavior and preferences',
      items: [
        {
          id: 'auto-backup',
          title: 'Automatic Backup',
          description: 'Backup data every 24 hours',
          type: 'toggle',
          value: autoBackup,
          icon: HardDrive,
          color: 'blue',
          onToggle: (value) => {
            buzz();
            setAutoBackup(value);
          }
        },
        {
          id: 'data-export',
          title: 'Export Data',
          description: 'Download system logs and reports',
          type: 'button',
          icon: Download,
          color: 'green',
          onPress: () => buzz('medium')
        },
        {
          id: 'system-reset',
          title: 'Reset Settings',
          description: 'Restore default configuration',
          type: 'button',
          icon: RotateCcw,
          color: 'orange',
          onPress: () => buzz('medium')
        }
      ]
    },
    {
      title: 'About',
      description: 'App information and support',
      items: [
        {
          id: 'app-version',
          title: 'App Version',
          description: '1.0.0 (Build 2024.1)',
          type: 'info',
          icon: Info,
          color: 'blue'
        },
        {
          id: 'help-support',
          title: 'Help & Support',
          description: 'Get help and contact support',
          type: 'navigation',
          icon: HelpCircle,
          color: 'green',
          onPress: () => buzz('medium')
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          description: 'View our privacy policy',
          type: 'navigation',
          icon: ExternalLink,
          color: 'blue',
          onPress: () => buzz('medium')
        }
      ]
    }
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return '#3b82f6';
      case 'green': return '#10b981';
      case 'red': return '#ef4444';
      case 'orange': return '#f59e0b';
      case 'purple': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getBackgroundColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-100';
      case 'green': return 'bg-emerald-50 border-emerald-100';
      case 'red': return 'bg-red-50 border-red-100';
      case 'orange': return 'bg-orange-50 border-orange-100';
      case 'purple': return 'bg-purple-50 border-purple-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  const SettingItemComponent = ({ item }: { item: SettingItem }) => (
    <Pressable
      onPress={item.onPress}
      disabled={item.type === 'info' || item.type === 'toggle'}
      className={cn(
        'flex-row items-center py-4 px-1',
        (item.type === 'button' || item.type === 'navigation') && 'active:bg-slate-50'
      )}
    >
      <View className={`w-10 h-10 rounded-2xl items-center justify-center mr-4 ${getBackgroundColor(item.color || 'blue')}`}>
        <item.icon size={20} color={getIconColor(item.color || 'blue')} />
      </View>
      
      <View className="flex-1">
        <Text className="text-slate-900 font-semibold text-base">{item.title}</Text>
        {item.description && (
          <Text className="text-slate-600 text-sm mt-1">{item.description}</Text>
        )}
      </View>

      {item.type === 'toggle' && (
        <Switch
          value={item.value || false}
          onValueChange={item.onToggle}
        />
      )}

      {item.type === 'navigation' && (
        <ChevronRight size={20} color="#94a3b8" />
      )}

      {item.type === 'button' && (
        <View className="w-8 h-8 rounded-lg bg-slate-100 items-center justify-center">
          <ExternalLink size={16} color="#64748b" />
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-slate-900 text-3xl font-bold mb-2">
              Settings
            </Text>
            <Text className="text-slate-600 text-base">
              Configure your app preferences and system settings
            </Text>
          </View>

          {/* Quick Actions */}
          <Card variant="subtle" size="lg" className="bg-white border border-slate-100 mb-8">
            <Text className="text-slate-900 font-semibold text-lg mb-4">Quick Actions</Text>
            <View className="flex-row space-x-3">
              <Pressable 
                onPress={() => buzz('medium')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 items-center"
              >
                <Database size={24} color="white" />
                <Text className="text-white font-semibold text-sm mt-2">Backup Now</Text>
              </Pressable>
              <Pressable 
                onPress={() => buzz('medium')}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 items-center"
              >
                <Activity size={24} color="white" />
                <Text className="text-white font-semibold text-sm mt-2">System Check</Text>
              </Pressable>
              <Pressable 
                onPress={() => buzz('medium')}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 items-center"
              >
                <Monitor size={24} color="white" />
                <Text className="text-white font-semibold text-sm mt-2">Diagnostics</Text>
              </Pressable>
            </View>
          </Card>

          {/* System Status */}
          <Card variant="subtle" size="lg" className="bg-white border border-slate-100 mb-8">
            <Text className="text-slate-900 font-semibold text-lg mb-4">System Status</Text>
            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Wifi size={20} color="#10b981" />
                  <Text className="text-slate-700 ml-3">Network Connection</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                  <Text className="text-emerald-600 font-semibold text-sm">Connected</Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Battery size={20} color="#10b981" />
                  <Text className="text-slate-700 ml-3">Battery Status</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                  <Text className="text-emerald-600 font-semibold text-sm">98%</Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <HardDrive size={20} color="#f59e0b" />
                  <Text className="text-slate-700 ml-3">Storage Usage</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                  <Text className="text-orange-600 font-semibold text-sm">64% Used</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} variant="subtle" size="lg" className="bg-white border border-slate-100 mb-6">
              <View className="mb-4">
                <Text className="text-slate-900 font-semibold text-lg">{section.title}</Text>
                {section.description && (
                  <Text className="text-slate-600 text-sm mt-1">{section.description}</Text>
                )}
              </View>
              
              <View className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    <SettingItemComponent item={item} />
                    {itemIndex < section.items.length - 1 && (
                      <View className="h-px bg-slate-100 ml-14" />
                    )}
                  </View>
                ))}
              </View>
            </Card>
          ))}

          {/* Danger Zone */}
          <Card variant="subtle" size="lg" className="bg-red-50 border border-red-200">
            <Text className="text-red-900 font-semibold text-lg mb-4">Danger Zone</Text>
            <Pressable 
              onPress={() => buzz('medium')}
              className="flex-row items-center py-3"
            >
              <View className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 items-center justify-center mr-4">
                <Trash2 size={20} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-red-900 font-semibold">Clear All Data</Text>
                <Text className="text-red-700 text-sm">Permanently delete all system data</Text>
              </View>
              <ChevronRight size={20} color="#dc2626" />
            </Pressable>
          </Card>

          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}