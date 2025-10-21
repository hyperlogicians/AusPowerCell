import React, { useState } from 'react';
import { View, Pressable, useWindowDimensions, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  BreastPumpIcon,
  Audit01Icon,
  UserMultipleIcon,
  Settings01Icon,
} from '@hugeicons/core-free-icons';

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

function IconWrapper({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return <View className="items-center justify-center">{children}</View>;
}

export function Sidebar({ items }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const isTablet = width >= 768;
  const sidebarWidth = isTablet ? 100 : 88;

  const handleItemPress = (item: SidebarItem) => {
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(item.route as any);
  };

  return (
    <View style={{ width: sidebarWidth }}>
      {/* Navigation Items */}
      <View className="flex-1 px-6 py-8 items-center">
        <View className="gap-14">
          {items.map((item) => {
            const isRouteActive =
              item.route === '/(tabs)'
                ? pathname === '/(tabs)'
                : pathname.startsWith(item.route);
            const isHovered = hoveredKey === item.key;

            const ACTIVE_BG = 'rgba(255,255,255,0.20)';
            const PRESSED_BG = 'rgba(255,255,255,0.15)';
            const HOVER_BG = 'rgba(255,255,255,0.10)';
            const TRANSPARENT = 'transparent';

            return (
              <Pressable
                key={item.key}
                onPress={() => handleItemPress(item)}
                onPressIn={() => setPressedKey(item.key)}
                onPressOut={() => setPressedKey(null)}
                {...(Platform.OS === 'web'
                  ? {
                      onHoverIn: () => setHoveredKey(item.key),
                      onHoverOut: () => setHoveredKey(null),
                    }
                  : {})}
                style={({ pressed }) => {
                  const bgColor = isRouteActive
                    ? ACTIVE_BG
                    : pressed
                    ? PRESSED_BG
                    : isHovered
                    ? HOVER_BG
                    : TRANSPARENT;

                  return {
                    backgroundColor: bgColor,
                    borderRadius: 16,
                  };
                }}
                className={cn(
                  'flex-row items-center justify-center px-4 py-4 rounded-2xl transition-all duration-200'
                )}
              >
                <IconWrapper focused={isRouteActive}>
                  {item.key === 'dashboard' ? (
                    <View className="rotate-180">
                      <HugeiconsIcon
                        icon={BreastPumpIcon}
                        size={28}
                        color="white"
                      />
                    </View>
                  ) : item.key === 'audit-logs' ? (
                    <HugeiconsIcon
                      icon={Audit01Icon}
                      size={28}
                      color="white"
                    />
                  ) : item.key === 'users' ? (
                    <HugeiconsIcon
                      icon={UserMultipleIcon}
                      size={28}
                      color="white"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={Settings01Icon}
                      size={28}
                      color="white"
                    />
                  )}
                </IconWrapper>

                {isRouteActive && (
                  <View className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 ml-2" />
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

// Sidebar Items Configuration
export const sidebarItems: SidebarItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: BreastPumpIcon,
    route: '/(tabs)',
  },
  {
    key: 'audit-logs',
    label: 'Audit Logs',
    icon: Audit01Icon,
    route: '/(tabs)/audit-logs',
  },
  {
    key: 'users',
    label: 'Users',
    icon: UserMultipleIcon,
    route: '/(tabs)/users',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings01Icon,
    route: '/(tabs)/settings',
  },
];
