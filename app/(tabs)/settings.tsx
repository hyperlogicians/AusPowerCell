import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, Dimensions } from 'react-native';
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
  const [displayName, setDisplayName] = useState('Aus..');
  const [deviceOfflineNotif, setDeviceOfflineNotif] = useState(true);
  const [valveNotif, setValveNotif] = useState(true);

  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const isLargeTablet = screenWidth >= 1024;

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
        <View className={cn(
          "rounded-full bg-[#A8D5DB] items-center justify-center mb-4 border border-[#6B9CA3]",
          isLargeTablet ? "w-40 h-40" : isTablet ? "w-36 h-36" : "w-32 h-32"
        )}>
          <User 
            size={isLargeTablet ? 80 : isTablet ? 72 : 64} 
            color="#2d3748" 
            strokeWidth={1.5} 
          />
          <View className={cn(
            "absolute bg-white rounded-lg items-center justify-center border border-[#A8D5DB] shadow-sm",
            isLargeTablet ? "-bottom-1 -right-1 w-10 h-10" : isTablet ? "-bottom-1 -right-1 w-9 h-9" : "-bottom-1 -right-1 w-8 h-8"
          )}>
            <Camera 
              size={isLargeTablet ? 20 : isTablet ? 18 : 16} 
              color="#64748b" 
            />
          </View>
        </View>
        <Text className={cn(
          "font-bold mb-2",
          isLargeTablet ? "text-[#1f2937] text-3xl" : isTablet ? "text-[#1f2937] text-2xl" : "text-[#1f2937] text-2xl"
        )}>AUS</Text>
        <Text className={cn(
          "text-[#64748b]",
          isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-base"
        )}>admin@auspowercell.com</Text>
      </View>

      {/* Edit Profile Section - Left Aligned */}
      <View className="mb-8">
        <Text className={cn(
          "font-semibold mb-4",
          isLargeTablet ? "text-[#1f2937] text-xl" : isTablet ? "text-[#1f2937] text-lg" : "text-[#1f2937] text-lg"
        )}>Edit Profile</Text>
        <Text className={cn(
          "font-medium mb-3",
          isLargeTablet ? "text-[#1f2937] text-base" : isTablet ? "text-[#1f2937] text-sm" : "text-[#1f2937] text-sm"
        )}>Display Name</Text>
        <View className={cn(
          isLargeTablet ? "w-[500px]" : isTablet ? "w-[400px]" : "w-96"
        )}>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            className={cn(
              "bg-[#C5E5EA] border border-[#A8D5DB] rounded-2xl px-4 text-[#1f2937]",
              isLargeTablet ? "py-4 text-lg" : isTablet ? "py-3 text-base" : "py-3 text-base"
            )}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Action Buttons - Bottom Right */}
      <View className="flex-row justify-end space-x-4 mt-auto">
        <Pressable className={cn(
          "bg-[#A8D5DB] rounded-2xl",
          isLargeTablet ? "px-8 py-4" : isTablet ? "px-7 py-3" : "px-6 py-3"
        )}>
          <Text className={cn(
            "font-medium",
            isLargeTablet ? "text-[#1f2937] text-lg" : isTablet ? "text-[#1f2937] text-base" : "text-[#1f2937] text-base"
          )}>Change Password</Text>
        </Pressable>
        <Pressable className={cn(
          "bg-[#D1D5DB] rounded-2xl",
          isLargeTablet ? "px-8 py-4" : isTablet ? "px-7 py-3" : "px-6 py-3"
        )}>
          <Text className={cn(
            "font-medium",
            isLargeTablet ? "text-[#6b7280] text-lg" : isTablet ? "text-[#6b7280] text-base" : "text-[#6b7280] text-base"
          )}>Save Edits</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderDevicesView = () => (
    <View className="flex-1">
      <View className="flex-row items-center justify-between mb-6">
        <Text className={cn(
          "font-semibold",
          isLargeTablet ? "text-[#1f2937] text-2xl" : isTablet ? "text-[#1f2937] text-xl" : "text-[#1f2937] text-xl"
        )}>Devices {devices.length}</Text>
        <Pressable className={cn(
          "bg-[#A8D5DB] rounded-xl flex-row items-center",
          isLargeTablet ? "px-6 py-3" : isTablet ? "px-5 py-2" : "px-4 py-2"
        )}>
          <RefreshCw 
            size={isLargeTablet ? 20 : isTablet ? 18 : 16} 
            color="#2d3748" 
          />
          <Text className={cn(
            "font-medium ml-2",
            isLargeTablet ? "text-[#2d3748] text-base" : isTablet ? "text-[#2d3748] text-sm" : "text-[#2d3748] text-sm"
          )}>Refresh</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {devices.map((device, index) => (
          <View key={device.id}>
            <View className={cn(
              isLargeTablet ? "py-6" : isTablet ? "py-5" : "py-4"
            )}>
              <Text className={cn(
                "font-semibold mb-1",
                isLargeTablet ? "text-[#1f2937] text-xl" : isTablet ? "text-[#1f2937] text-lg" : "text-[#1f2937] text-lg"
              )}>{device.name}</Text>
              <Text className={cn(
                "mb-2",
                isLargeTablet ? "text-[#64748b] text-base" : isTablet ? "text-[#64748b] text-sm" : "text-[#64748b] text-sm"
              )}>{device.deviceId}</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className={cn(
                    "font-medium",
                    isLargeTablet ? "text-[#1f2937] text-base" : isTablet ? "text-[#1f2937] text-sm" : "text-[#1f2937] text-sm"
                  )}>Status: </Text>
                  <Text className={cn(
                    "font-semibold",
                    isLargeTablet ? "text-base" : isTablet ? "text-sm" : "text-sm"
                  )} style={{ color: getStatusColor(device.status) }}>
                    {getStatusText(device.status)}
                  </Text>
                </View>
                <Pressable className={cn(
                  "bg-[#A8D5DB] rounded-xl",
                  isLargeTablet ? "px-6 py-2" : isTablet ? "px-5 py-1.5" : "px-4 py-1.5"
                )}>
                  <Text className={cn(
                    "font-medium",
                    isLargeTablet ? "text-[#2d3748] text-base" : isTablet ? "text-[#2d3748] text-sm" : "text-[#2d3748] text-sm"
                  )}>Refresh</Text>
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
      <Text className={cn(
        "font-semibold mb-6",
        isLargeTablet ? "text-[#1f2937] text-2xl" : isTablet ? "text-[#1f2937] text-xl" : "text-[#1f2937] text-xl"
      )}>Push Notifications</Text>

      <View className={cn(
        isLargeTablet ? "mb-8" : isTablet ? "mb-6" : "mb-6"
      )}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className={cn(
              "font-semibold mb-1",
              isLargeTablet ? "text-[#1f2937] text-lg" : isTablet ? "text-[#1f2937] text-base" : "text-[#1f2937] text-base"
            )}>Device Offline</Text>
            <Text className={cn(
              isLargeTablet ? "text-[#64748b] text-base" : isTablet ? "text-[#64748b] text-sm" : "text-[#64748b] text-sm"
            )}>Notify when a device goes offline</Text>
          </View>
          <Switch
            value={deviceOfflineNotif}
            onValueChange={setDeviceOfflineNotif}
          />
        </View>
      </View>

      <View className={cn(
        isLargeTablet ? "mb-8" : isTablet ? "mb-6" : "mb-6"
      )}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className={cn(
              "font-semibold mb-1",
              isLargeTablet ? "text-[#1f2937] text-lg" : isTablet ? "text-[#1f2937] text-base" : "text-[#1f2937] text-base"
            )}>Valve Open/Close</Text>
            <Text className={cn(
              isLargeTablet ? "text-[#64748b] text-base" : isTablet ? "text-[#64748b] text-sm" : "text-[#64748b] text-sm"
            )}>Notify when a valve is opened or closed</Text>
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
        <View className={cn(
          "bg-white rounded-2xl shadow-sm",
          isLargeTablet ? "w-[400px] mx-12 my-12 px-10 pt-10" : 
          isTablet ? "w-[360px] mx-10 my-10 px-8 pt-8" : 
          "w-[320px] mx-8 my-8 px-8 pt-8"
        )}>
          <View className={cn(
            isLargeTablet ? "mb-12" : isTablet ? "mb-10" : "mb-10"
          )}>
            <Text className={cn(
              "font-bold mb-3",
              isLargeTablet ? "text-[#1f2937] text-4xl" : isTablet ? "text-[#1f2937] text-3xl" : "text-[#1f2937] text-3xl"
            )}>Settings</Text>
            <Text className={cn(
              isLargeTablet ? "text-[#64748b] text-lg" : isTablet ? "text-[#64748b] text-base" : "text-[#64748b] text-base"
            )}>Configure system preferences and parameters</Text>
          </View>

          <View className="space-y-3">
            <Pressable
              onPress={() => setSelectedView('account')}
              className={cn(
                'flex-row items-center rounded-2xl',
                isLargeTablet ? 'px-8 py-5' : isTablet ? 'px-7 py-4' : 'px-6 py-4',
                selectedView === 'account' ? 'bg-[#C5E5EA]' : 'bg-transparent'
              )}
            >
              <User 
                size={isLargeTablet ? 24 : isTablet ? 22 : 20} 
                color="#2d3748" 
              />
              <Text className={cn(
                "font-medium ml-3",
                isLargeTablet ? "text-[#2d3748] text-lg" : isTablet ? "text-[#2d3748] text-base" : "text-[#2d3748] text-base"
              )}>Account</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedView('devices')}
              className={cn(
                'flex-row items-center rounded-2xl',
                isLargeTablet ? 'px-8 py-5' : isTablet ? 'px-7 py-4' : 'px-6 py-4',
                selectedView === 'devices' ? 'bg-[#C5E5EA]' : 'bg-transparent'
              )}
            >
              <SettingsIcon 
                size={isLargeTablet ? 24 : isTablet ? 22 : 20} 
                color="#2d3748" 
              />
              <Text className={cn(
                "font-medium ml-3",
                isLargeTablet ? "text-[#2d3748] text-lg" : isTablet ? "text-[#2d3748] text-base" : "text-[#2d3748] text-base"
              )}>Device Management</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedView('notifications')}
              className={cn(
                'flex-row items-center rounded-2xl',
                isLargeTablet ? 'px-8 py-5' : isTablet ? 'px-7 py-4' : 'px-6 py-4',
                selectedView === 'notifications' ? 'bg-[#C5E5EA]' : 'bg-transparent'
              )}
            >
              <Bell 
                size={isLargeTablet ? 24 : isTablet ? 22 : 20} 
                color="#2d3748" 
              />
              <Text className={cn(
                "font-medium ml-3",
                isLargeTablet ? "text-[#2d3748] text-lg" : isTablet ? "text-[#2d3748] text-base" : "text-[#2d3748] text-base"
              )}>Notification</Text>
            </Pressable>
          </View>
        </View>

        {/* Main Content */}
        <View className={cn(
          "flex-1 bg-white rounded-3xl shadow-sm",
          isLargeTablet ? "m-12 p-16" : isTablet ? "m-10 p-14" : "m-8 p-12"
        )}>
          {selectedView === 'account' && renderAccountView()}
          {selectedView === 'devices' && renderDevicesView()}
          {selectedView === 'notifications' && renderNotificationsView()}
        </View>
      </View>
    </SafeAreaView>
  );
}