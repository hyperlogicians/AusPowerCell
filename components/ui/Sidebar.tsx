import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, useWindowDimensions, Platform, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { House, ClipboardClock , Settings as SettingsLucide, UsersRound } from 'lucide-react-native';


interface SidebarItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ focused: boolean; size?: number }>;
  route: string;
}

interface SidebarProps {
  items: SidebarItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

// Lucide-based icons for sidebar
function IconWrapper({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  return (
    <View className={`items-center justify-center ${focused ? 'opacity-100' : 'opacity-70'}`}>
      {children}
    </View>
  );
}

export function Sidebar({ items }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  
  const isTablet = width >= 768;
  const sidebarWidth = isTablet ? 100 : 88;

  const handleItemPress = (item: SidebarItem) => {
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(item.route as any);
  };

  const handleToggle = () => {};

  return (
    <View 
      className="bg-transparent border-r border-white/0"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <View className="px-6 py-10">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-3">
              <Image
                source={Platform.OS === 'web' ? { uri: '/logo.png' } : require('../assets/logo.png')}
                className="h-8 w-40"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Navigation Items */}
      <View className="flex-1 px-6 py-8">
        <View className="space-y-3">
          {items.map((item) => {
            const isRouteActive = item.route === '/(tabs)'
              ? pathname === '/(tabs)'
              : pathname.startsWith(item.route);
            const isHovered = hoveredKey === item.key;
            const isActive = isRouteActive || isHovered;
            
            return (
              <Pressable
                key={item.key}
                onPress={() => handleItemPress(item)}
                onHoverIn={() => setHoveredKey(item.key)}
                onHoverOut={() => setHoveredKey(null)}
                className={cn(
                  'flex-row items-center px-4 py-4 rounded-2xl transition-all duration-200',
                  isActive ? 'bg-white/10 border border-white/20 shadow-lg shadow-black/10' : 'bg-transparent'
                )}
              >
                <View className="mr-0">
                  {
                    item.key === 'dashboard' ? (
                      <IconWrapper focused={isActive}>
                        <House size={22} color={isActive ? 'white' : 'rgba(255,255,255,0.7)'} />
                      </IconWrapper>
                    ) : item.key === 'audit-logs' ? (
                      <IconWrapper focused={isActive}>
                        <ClipboardClock size={22} color={isActive ? 'white' : 'rgba(255,255,255,0.7)'} />
                      </IconWrapper>
                    ) : item.key === 'users' ? (
                      <IconWrapper focused={isActive}>
                        <UsersRound size={22} color={isActive ? 'white' : 'rgba(255,255,255,0.7)'} />
                      </IconWrapper>
                    ) : (
                      <IconWrapper focused={isActive}>
                        <SettingsLucide size={22} color={isActive ? 'white' : 'rgba(255,255,255,0.7)'} />
                      </IconWrapper>
                    )
                  }
                </View>
                
                
                
                {isRouteActive && (
                  <View className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 py-6" />
    </View>
  );
}

// Export the sidebar items configuration
export const sidebarItems: SidebarItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: House,
    route: '/(tabs)',
  },
  {
    key: 'audit-logs',
    label: 'Audit Logs',
    icon: ClipboardClock,
    route: '/(tabs)/audit-logs',
  },
  {
    key: 'users',
    label: 'Users',
    icon: UsersRound,
    route: '/(tabs)/users',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: SettingsLucide,
    route: '/(tabs)/settings',
  },
];
