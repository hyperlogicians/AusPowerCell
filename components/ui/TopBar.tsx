import React from "react";
import { View, Text, Pressable, Image, Platform, Animated, Dimensions } from "react-native";
import { usePathname } from "expo-router";
import * as Haptics from "expo-haptics";
import { Bell, UserRound, Wifi, Radio, LogOut } from "lucide-react-native";
import { useEffect, useState, useRef } from "react";
import { statusStore } from "../../lib/status";
import { NotificationModal } from "../NotificationModal";

function getTitle(pathname: string): string {
  if (pathname.includes("/audit-logs")) return "Audit Logs";
  if (pathname.includes("/users")) return "Users";
  if (pathname.includes("/settings")) return "Settings";
  return "Dashboard";
}

const { width: screenWidth } = Dimensions.get("window");

export function TopBar() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const [, setTick] = useState(0);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [isUserProfileExpanded, setIsUserProfileExpanded] = useState(false);
  
  // User data
  const userName = "John L.";
  const baseWidth = 40; // Avatar width
  const nameWidth = userName.length * 8 + 10; // Approximate width per character + padding
  const logoutButtonWidth = 30; // Logout button width
  const padding = 20; // Total padding
  const expandedWidth = baseWidth + nameWidth + logoutButtonWidth + padding;
  
  // Animation values
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const buzz = () => {
    if (Platform.OS !== "web" && typeof Haptics.impactAsync === "function") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNotificationPress = () => {
    buzz();
    setIsNotificationModalVisible(true);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalVisible(false);
  };

  const handleUserProfilePress = () => {
    buzz();
    if (isUserProfileExpanded) {
      // Close animation
      Animated.parallel([
        Animated.timing(expandAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsUserProfileExpanded(false);
      });
    } else {
      // Open animation
      setIsUserProfileExpanded(true);
      Animated.parallel([
        Animated.timing(expandAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleLogout = () => {
    buzz();
    // Add logout logic here
    console.log("Logout pressed");
    // Close the profile button
    handleUserProfilePress();
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
          const label = isConnected ? ssid || type || "AusWIFI" : "Offline";
          statusStore.setWifiName(label);
        }
      } catch (e) {
        if (!statusStore.wifiName) statusStore.setWifiName("AusWIFI");
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
    <>
      {/* Backdrop for outside click detection */}
      {isUserProfileExpanded && (
        <Pressable
          className="absolute inset-0 z-10"
          onPress={handleUserProfilePress}
        />
      )}
      
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between bg-transparent">
      {/* Left: Logo + Title */}
      <View className="flex-row items-center justify-center ml-2">
        <Image
          source={require('../../public/apclogo.png')}
          className="h-10 w-10 mr-3"
          resizeMode="contain"
        />
        <Text className="text-white text-2xl mb-1 font-regular">
          AusPowerCell
        </Text>
      </View>

      {/* Right: Actions */}
      <View className="flex-row items-center">
        {/* Connection + Status - Animated slide */}
        <Animated.View 
          className="flex-row mr-8"
          style={{
            transform: [{
              translateX: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15], // Slide left when expanding
              })
            }]
          }}
        >
          <View>
            <Wifi size={18} color="#34d399" />
            <Text className="text-white/90 text-lg mt-1 leading-4">
              {statusStore.wifiName || "AusWIFI"}
            </Text>
            <Text className="text-white/60 text-[10px] text-right">Network</Text>
          </View>
        </Animated.View>

        {/* Notification Bell - Animated slide */}
        <Animated.View
          style={{
            transform: [{
              translateX: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15], // Slide left when expanding
              })
            }]
          }}
        >
          <Pressable
            onPress={handleNotificationPress}
            className="w-10 h-10 rounded-xl items-center justify-center mr-8 hover:bg-white/12"
            aria-label="Notifications"
          >
            <View className="w-1.5 h-1.5 bg-red-400 rounded-full absolute top-2 right-2" />
            <Bell size={18} color="#ffffff" />
          </Pressable>
        </Animated.View>

        {/* User Profile Button - Expanding */}
        <View className="relative">
          <Animated.View
            style={{
              width: expandAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [baseWidth, expandedWidth], // Dynamic width based on name length
              }),
              height: 40,
              borderRadius: 20,
              backgroundColor: 'white',
              overflow: 'hidden',
            }}
          >
            <Pressable
              onPress={handleUserProfilePress}
              className="flex-row items-center h-full"
            >
              {/* User Icon - Appears later in animation */}
              <Animated.View 
                className="w-10 h-10 rounded-full bg-blue-100 border border-[#4B4B4B] items-center justify-center"
                style={{
                  transform: [{
                    scale: expandAnimation.interpolate({
                      inputRange: [0, 0.4, 0.8, 1],
                      outputRange: [1, 0.9, 0.7, 0.8], // Scale down then back up
                    })
                  }]
                }}
              >
                <UserRound size={16} color="#4B4B4B" />
              </Animated.View>
              
              {/* User Name and Logout - Only visible when expanded */}
              <Animated.View
                className="flex-row items-center ml-3"
                style={{
                  opacity: expandAnimation,
                  transform: [{
                    translateX: expandAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0], // Slide in from left
                    })
                  }]
                }}
              >
                <Text className="text-gray-800 text-sm font-medium mr-3">
                  {userName}
                </Text>
                <Pressable
                  onPress={handleLogout}
                  className="items-center justify-center border-l border-gray-300 pl-3"
                >
                  <LogOut size={16} color="#6b7280" />
                </Pressable>
              </Animated.View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
      
        {/* Notification Modal */}
        <NotificationModal
          visible={isNotificationModalVisible}
          onClose={handleCloseNotificationModal}
        />
      </View>
    </>
  );
}
