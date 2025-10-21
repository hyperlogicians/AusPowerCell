import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from '../../components/ui/Switch';
import { cn } from '../../lib/utils';
import { 
  User,
  Settings as SettingsIcon,
  Bell,
  Camera,
  RefreshCw
} from 'lucide-react-native';

type SettingView = 'account' | 'devices' | 'notifications';

interface Device {
  id: string;
  name: string;
  deviceId: string;
  status: 'online' | 'offline' | 'error';
}

export default function Settings() {
  const [selectedView, setSelectedView] = useState<SettingView>('account');
  const [displayName, setDisplayName] = useState('John L.');
  const [deviceOfflineNotif, setDeviceOfflineNotif] = useState(true);
  const [valveNotif, setValveNotif] = useState(true);

  const devices: Device[] = [
    { id: '1', name: 'Irrigation Zone A1', deviceId: 'APC-20N-02', status: 'error' },
    { id: '2', name: 'Main Supply Line', deviceId: 'APC-20N-02', status: 'online' },
    { id: '3', name: 'Irrigation Zone A1', deviceId: 'APC-20N-02', status: 'offline' },
    { id: '4', name: 'Irrigation Zone B2', deviceId: 'APC-20N-03', status: 'online' },
    { id: '5', name: 'Backup Supply Line', deviceId: 'APC-20N-04', status: 'offline' },
    { id: '6', name: 'Irrigation Zone C1', deviceId: 'APC-20N-05', status: 'online' },
    { id: '7', name: 'Irrigation Zone D1', deviceId: 'APC-20N-06', status: 'error' },
    { id: '8', name: 'Main Control Unit', deviceId: 'APC-20N-07', status: 'online' },
    { id: '9', name: 'Irrigation Zone E1', deviceId: 'APC-20N-08', status: 'offline' },
    { id: '10', name: 'Secondary Supply', deviceId: 'APC-20N-09', status: 'online' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'offline': return '#64748b';
      case 'error': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const renderAccountView = () => (
    <View className="flex-1">
      {/* Profile Section - Centered */}
      <View className="items-center mb-12">
        <View className="w-24 h-24 rounded-full bg-[#A8D5DB] items-center justify-center mb-4 border border-[#6B9CA3]">
          <User size={48} color="#2d3748" strokeWidth={1.5} />
          <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-lg items-center justify-center border border-[#A8D5DB] shadow-sm">
            <Camera size={16} color="#64748b" />
          </View>
        </View>
        <Text className="text-[#1f2937] text-2xl font-bold mb-2">John L.</Text>
        <Text className="text-[#64748b] text-base">johnlegend@auspowercell.com</Text>
      </View>

      {/* Edit Profile Section - Left Aligned */}
      <View className="mb-8">
        <Text className="text-[#1f2937] text-lg font-semibold mb-4">Edit Profile</Text>
        <Text className="text-[#1f2937] text-sm font-medium mb-3">Display Name</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          className="bg-[#C5E5EA] border border-[#A8D5DB] rounded-2xl px-4 py-4 text-[#1f2937] text-base"
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Action Buttons - Bottom Right */}
      <View className="flex-row justify-end space-x-4 mt-auto">
        <Pressable className="bg-[#A8D5DB] rounded-2xl px-6 py-3">
          <Text className="text-[#1f2937] text-base font-medium">Change Password</Text>
        </Pressable>
        <Pressable className="bg-[#D1D5DB] rounded-2xl px-6 py-3">
          <Text className="text-[#6b7280] text-base font-medium">Save Edits</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderDevicesView = () => (
    <View className="flex-1">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-[#1f2937] text-xl font-semibold">Devices {devices.length}</Text>
        <Pressable className="bg-[#A8D5DB] rounded-xl px-4 py-2 flex-row items-center">
          <RefreshCw size={16} color="#2d3748" />
          <Text className="text-[#2d3748] text-sm font-medium ml-2">Refresh</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {devices.map((device, index) => (
          <View key={device.id}>
            <View className="py-4">
              <Text className="text-[#1f2937] text-lg font-semibold mb-1">{device.name}</Text>
              <Text className="text-[#64748b] text-sm mb-2">{device.deviceId}</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-[#1f2937] text-sm font-medium">Status: </Text>
                  <Text className="text-sm font-semibold" style={{ color: getStatusColor(device.status) }}>
                    {getStatusText(device.status)}
                  </Text>
                </View>
                <Pressable className="bg-[#A8D5DB] rounded-xl px-4 py-1.5">
                  <Text className="text-[#2d3748] text-sm font-medium">Refresh</Text>
                </Pressable>
              </View>
            </View>
            {index < devices.length - 1 && <View className="h-px bg-[#e5e7eb]" />}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderNotificationsView = () => (
    <View className="flex-1">
      <Text className="text-[#1f2937] text-xl font-semibold mb-6">Push Notifications</Text>

      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-[#1f2937] text-base font-semibold mb-1">Device Offline</Text>
            <Text className="text-[#64748b] text-sm">Notify when a device goes offline</Text>
          </View>
          <Switch
            value={deviceOfflineNotif}
            onValueChange={setDeviceOfflineNotif}
          />
        </View>
      </View>

      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-[#1f2937] text-base font-semibold mb-1">Valve Open/Close</Text>
            <Text className="text-[#64748b] text-sm">Notify when a valve is opened or closed</Text>
          </View>
          <Switch
            value={valveNotif}
            onValueChange={setValveNotif}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb]" edges={['top']}>
      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <View className="w-[320px] bg-[#f3f4f6] rounded-tr-3xl rounded-br-3xl px-8 pt-8">
          <View className="mb-10">
            <Text className="text-[#1f2937] text-3xl font-bold mb-3">Settings</Text>
            <Text className="text-[#64748b] text-base">Configure system preferences and parameters</Text>
          </View>

          <View className="space-y-3">
            <Pressable
              onPress={() => setSelectedView('account')}
              className={cn(
                'flex-row items-center px-6 py-4 rounded-2xl',
                selectedView === 'account' ? 'bg-[#C5E5EA]' : 'bg-transparent'
              )}
            >
              <User size={20} color="#2d3748" />
              <Text className="text-[#2d3748] text-base font-medium ml-3">Account</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedView('devices')}
              className={cn(
                'flex-row items-center px-6 py-4 rounded-2xl',
                selectedView === 'devices' ? 'bg-[#C5E5EA]' : 'bg-transparent'
              )}
            >
              <SettingsIcon size={20} color="#2d3748" />
              <Text className="text-[#2d3748] text-base font-medium ml-3">Device Management</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedView('notifications')}
              className={cn(
                'flex-row items-center px-6 py-4 rounded-2xl',
                selectedView === 'notifications' ? 'bg-[#C5E5EA]' : 'bg-transparent'
              )}
            >
              <Bell size={20} color="#2d3748" />
              <Text className="text-[#2d3748] text-base font-medium ml-3">Notification</Text>
            </Pressable>
          </View>

          {/* Additional icons at bottom */}
          <View className="mt-12 space-y-4">
            <View className="w-8 h-8 items-center justify-center">
              <User size={20} color="#9ca3af" />
            </View>
            <View className="w-8 h-8 items-center justify-center">
              <SettingsIcon size={20} color="#9ca3af" />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1 bg-white m-8 rounded-3xl p-12 shadow-sm">
          {selectedView === 'account' && renderAccountView()}
          {selectedView === 'devices' && renderDevicesView()}
          {selectedView === 'notifications' && renderNotificationsView()}
        </View>
      </View>
    </SafeAreaView>
  );
}