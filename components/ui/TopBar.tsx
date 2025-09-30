import React from "react";
import { View, Text, Pressable, Image, Platform } from "react-native";
import { usePathname } from "expo-router";
import * as Haptics from "expo-haptics";
import { Bell, UserRound, Wifi, SignalHigh } from "lucide-react-native";
import { useEffect, useState } from "react";
import { statusStore } from "../../lib/status";
import { Logo } from "./Logo";
// Gradient rendered at layout level; keep TopBar transparent.

function getTitle(pathname: string): string {
  if (pathname.includes("/audit-logs")) return "Audit Logs";
  if (pathname.includes("/users")) return "Users";
  if (pathname.includes("/settings")) return "Settings";
  return "Dashboard";
}

export function TopBar() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const [, setTick] = useState(0);

  const buzz = () => {
    if (Platform.OS !== "web" && typeof Haptics.impactAsync === "function") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Subscribe to status changes (wifi name + health)
  useEffect(() => {
    const unsub = statusStore.subscribe(() => setTick((t) => t + 1));

    const updateNetwork = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ExpoNetwork: any = require("expo-network");
        if (
          ExpoNetwork &&
          typeof ExpoNetwork.getNetworkStateAsync === "function"
        ) {
          const state = await ExpoNetwork.getNetworkStateAsync();
          const ssid = state?.ssid || state?.details?.ssid;
          const type =
            (state?.type && String(state.type).toUpperCase()) || undefined;
          const isConnected = state?.isConnected ?? true;
          const label = isConnected ? ssid || type || "Wi‑Fi" : "Offline";
          statusStore.setWifiName(label);
        }
      } catch (e) {
        if (!statusStore.wifiName) statusStore.setWifiName("Wi‑Fi");
      }
    };

    updateNetwork();
    const intervalId = setInterval(updateNetwork, 15000);
    return () => {
      clearInterval(intervalId);
      unsub();
    };
  }, []);

  return (
    <View className="px-6 pt-6 pb-4 flex-row items-center justify-between bg-transparent">
      {/* Left: Logo + Title */}
      <View className="flex-row items-center">
        <Text className="text-white text-2xl font-light tracking-wide">
          {title}
        </Text>
      </View>

      {/* Right: Actions */}
      <View className="flex-row items-center">
        {/* Connection + Status */}
        <View className="flex-row items-center mr-3">
          <View className="items-center mr-4">
            <SignalHigh
              size={16}
              color={
                statusStore.systemHealth === "good"
                  ? "#34d399"
                  : statusStore.systemHealth === "medium"
                  ? "#f59e0b"
                  : "#ef4444"
              }
            />
            <Text className="text-white/90 text-sm leading-4 capitalize">
              {statusStore.systemHealth}
            </Text>
            <Text className="text-white/60 text-[10px]">Status</Text>
          </View>
          <View className="items-center mr-2">
            <Wifi size={16} color="#34d399" />
            <Text className="text-white/90 text-sm leading-4">
              {statusStore.wifiName || "Wi‑Fi"}
            </Text>
            <Text className="text-white/60 text-[10px]">Network</Text>
          </View>
        </View>
        <Pressable
          onPress={buzz}
          className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 items-center justify-center mr-3 hover:bg-white/12"
          aria-label="Notifications"
        >
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
