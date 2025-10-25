import React, { useState } from 'react';
import { View, Pressable, useWindowDimensions, Platform, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { cn } from '../../lib/utils';
import * as Haptics from 'expo-haptics';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
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

  // Improved route matching function
  const isRouteActive = (itemRoute: string): boolean => {
    // Remove trailing slashes for comparison
    const cleanPathname = pathname.replace(/\/+$/, '');
    const cleanRoute = itemRoute.replace(/\/+$/, '');

    console.log('🔍 Debug route matching:');
    console.log('  - Current pathname:', pathname);
    console.log('  - Clean pathname:', cleanPathname);
    console.log('  - Checking route:', itemRoute);
    console.log('  - Clean route:', cleanRoute);

    // Dashboard special case - match only root routes
    if (cleanRoute === '/(tabs)') {
      const isMatch = cleanPathname === '/(tabs)' || cleanPathname === '' || cleanPathname === '/';
      console.log('  - Dashboard match:', isMatch);
      return isMatch;
    }

    // For other routes, extract the actual route path (remove /(tabs) prefix)
    const actualRoute = cleanRoute.replace(/^\/\(tabs\)/, '');
    const exactMatch = cleanPathname === actualRoute;
    const startsWithMatch = cleanPathname.startsWith(actualRoute + '/');
    const isMatch = exactMatch || startsWithMatch;
    
    console.log('  - Actual route (no tabs):', actualRoute);
    console.log('  - Exact match:', exactMatch);
    console.log('  - Starts with match:', startsWithMatch);
    console.log('  - Final match:', isMatch);
    
    return isMatch;
  };

  return (
    <View style={{ width: sidebarWidth }}>
      {/* Navigation Items */}
      <View className="flex-1 px-6 py-8 items-center">
        <View className="gap-14">
          {items.map((item) => {
            const isActive = isRouteActive(item.route);
            const isHovered = hoveredKey === item.key;
            const isPressed = pressedKey === item.key;

            const ACTIVE_BG = 'rgba(255,255,255,0.20)';
            const PRESSED_BG = 'rgba(255,255,255,0.15)';
            const HOVER_BG = 'rgba(255,255,255,0.10)';
            const TRANSPARENT = 'transparent';

            // Determine background color
            const bgColor = isActive
              ? ACTIVE_BG
              : isPressed
              ? PRESSED_BG
              : isHovered
              ? HOVER_BG
              : TRANSPARENT;

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
                style={{
                  backgroundColor: bgColor,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconWrapper focused={isActive}>
                  {item.key === 'dashboard' ? (
                    <Image 
                      source={require('../../public/valve.png')} 
                      style={{ 
                        width: 34, 
                        height: 34
                      }}
                      resizeMode="contain"
                    />
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

                {/* Active indicator removed to match screenshot */}
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
    icon: () => null, // Icon is handled in the component
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