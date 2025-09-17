import React from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Bell, UserRound } from 'lucide-react-native';
import { Logo } from './Logo';
// Gradient rendered at layout level; keep TopBar transparent.

function getTitle(pathname: string): string {
  if (pathname.includes('/audit-logs')) return 'Audit Logs';
  if (pathname.includes('/users')) return 'Users';
  if (pathname.includes('/settings')) return 'Settings';
  return 'Dashboard';
}

export function TopBar() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  const buzz = () => {
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View className="px-6 pt-6 pb-4 flex-row items-center justify-between bg-transparent">
      {/* Left: Logo + Title */}
      <View className="flex-row items-center">
        <Text className="text-white text-2xl font-light tracking-wide">{title}</Text>
      </View>

      {/* Right: Actions */}
      <View className="flex-row items-center">
        <Pressable onPress={buzz} className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 items-center justify-center mr-3 hover:bg-white/12" aria-label="Notifications">
          <View className="w-1.5 h-1.5 bg-red-400 rounded-full absolute top-2 right-2" />
          <Bell size={18} color="#ffffff" />
        </Pressable>
        <Pressable onPress={buzz} className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 items-center justify-center">
            <UserRound size={18} color="#ffffff" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}


