import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "../../components/ui/Switch";
import { cn } from "../../lib/utils";

import { Button } from "../../components/ui/Button";
import {
  UserRound,
  Settings as SettingsIcon,
  Bell,
  Camera,
  RefreshCw,
  MapPin,
} from "lucide-react-native";

type SettingView = "account" | "devices" | "notifications" | "siteManagement";

interface Device {
  id: string;
  name: string;
  deviceId: string;
  status: "online" | "offline" | "error";
}

export default function Settings() {
  const [selectedView, setSelectedView] = useState<SettingView>("account");
  const [displayName, setDisplayName] = useState("John L.");
  const [deviceOfflineNotif, setDeviceOfflineNotif] = useState(true);
  const [valveNotif, setValveNotif] = useState(true);
  const [selectedSite, setSelectedSite] = useState<string>("1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const isTablet = screenWidth >= 768;
  const isLargeTablet = screenWidth >= 1024;

  const devices: Device[] = [
    {
      id: "1",
      name: "Irrigation Zone A1",
      deviceId: "APC-20N-02",
      status: "error",
    },
    {
      id: "2",
      name: "Main Supply Line",
      deviceId: "APC-20N-02",
      status: "online",
    },
    {
      id: "3",
      name: "Irrigation Zone A1",
      deviceId: "APC-20N-02",
      status: "offline",
    },
    {
      id: "4",
      name: "Irrigation Zone B2",
      deviceId: "APC-20N-03",
      status: "online",
    },
    {
      id: "5",
      name: "Backup Supply Line",
      deviceId: "APC-20N-04",
      status: "offline",
    },
    {
      id: "6",
      name: "Irrigation Zone C1",
      deviceId: "APC-20N-05",
      status: "online",
    },
    {
      id: "7",
      name: "Irrigation Zone D1",
      deviceId: "APC-20N-06",
      status: "error",
    },
    {
      id: "8",
      name: "Main Control Unit",
      deviceId: "APC-20N-07",
      status: "online",
    },
    {
      id: "9",
      name: "Irrigation Zone E1",
      deviceId: "APC-20N-08",
      status: "offline",
    },
    {
      id: "10",
      name: "Secondary Supply",
      deviceId: "APC-20N-09",
      status: "online",
    },
  ];

  const sites = [
    { id: "1", name: "Site 1", location: "3 Zones" },
    { id: "2", name: "Site 2", location: "3 Zones" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#10b981";
      case "offline":
        return "#64748b";
      case "error":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  const renderAccountView = () => (
    <View className="flex-1">
      <View>
        {/* Profile Section - Centered */}
        <View className="items-center mb-8">
          <View
            className={cn(
              "rounded-full bg-sky-800/20 items-center justify-center mb-3 border border-[#8dbfc9]",
              isLargeTablet ? "w-32 h-32" : isTablet ? "w-28 h-28" : "w-24 h-24"
            )}
          >
            <UserRound
              size={isLargeTablet ? 68 : isTablet ? 60 : 52}
              color="#0f172a"
              strokeWidth={1.4}
            />
            <View
              className={cn(
                "absolute bg-white rounded-full items-center justify-center border border-[#8dbfc9] shadow",
                "-bottom-2 -right-1",
                isLargeTablet ? "w-10 h-10" : isTablet ? "w-9 h-9" : "w-8 h-8"
              )}
            >
              <Camera
                size={isLargeTablet ? 18 : isTablet ? 16 : 14}
                color="#0f172a"
              />
            </View>
          </View>
          <Text
            className={cn(
              "font-bold text-[#0f172a]",
              isLargeTablet ? "text-2xl" : isTablet ? "text-xl" : "text-xl"
            )}
          >
            John L.
          </Text>
          <Text
            className={cn(
              "text-[#64748b]",
              isLargeTablet ? "text-base" : isTablet ? "text-sm" : "text-sm"
            )}
          >
            johnlegend@auspowercell.com
          </Text>
        </View>

        {/* Edit Profile Section - Left Aligned */}
        <View className="mb-6 w-full">
          <Text className="text-[#94a3b8] font-semibold text-lg mb-5">
            Edit Profile
          </Text>
          <View className="flex-col gap-2 px-2 w-full">
            <Text className="text-[#0f172a] font-semibold mb-2 text-sm">
              Display Name
            </Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              className="bg-black/10 rounded-xl border border-black/20 focus:outline-none focus:ring-0 px-4 py-3 w-full text-[#0f172a] text-base"
              placeholderTextColor="#0f172a99"
            />
          </View>
        </View>
      </View>

      {/* Action Buttons - Inside Container, Right Aligned */}
      <View className="flex-row justify-end px-2">
        <Button
          onPress={() => {}}
          loading={false}
          className="my-4 bg-sky-800/20 rounded-xl border border-sky-800/20 px-5 py-2"
        >
          Save Edits
        </Button>
      </View>
    </View>
  );

  const renderDevicesView = () => (
    <View className="flex-1">
      <View className="flex-row items-center justify-between border-b border-black/10 pb-6">
        <View className="flex-row items-center gap-2">
          <Text
            className="font-medium text-black/70 text-xl"
          >
            Devices
          </Text>
          <Text
            className="font-semibold text-black/50 text-xl"
          >{devices.length}
          </Text>
        </View>
        <Pressable
          className="bg-sky-800/20 rounded-xl flex-row items-center border border-sky-800/20 px-4 py-2"
        >
          <RefreshCw
            size={isLargeTablet ? 20 : isTablet ? 18 : 16}
            color="#2d3748"
          />
          <Text
            className="font-medium ml-2 text-black/70 text-base"
          >
            Refresh
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {devices.map((device, index) => (
          <View key={device.id}>
            <View
              className={cn(
                isLargeTablet ? "py-6" : isTablet ? "py-5" : "py-4"
              )}
            >
              <Text
                className={cn(
                  "font-semibold mb-1",
                  isLargeTablet
                    ? "text-[#1f2937] text-xl"
                    : isTablet
                    ? "text-[#1f2937] text-lg"
                    : "text-[#1f2937] text-lg"
                )}
              >
                {device.name}
              </Text>
              <Text
                className={cn(
                  "mb-2",
                  isLargeTablet
                    ? "text-[#64748b] text-base"
                    : isTablet
                    ? "text-[#64748b] text-sm"
                    : "text-[#64748b] text-sm"
                )}
              >
                {device.deviceId}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text
                    className={cn(
                      "font-medium",
                      isLargeTablet
                        ? "text-[#1f2937] text-base"
                        : isTablet
                        ? "text-[#1f2937] text-sm"
                        : "text-[#1f2937] text-sm"
                    )}
                  >
                    Status:{" "}
                  </Text>
                  <Text
                    className={cn(
                      "font-semibold",
                      isLargeTablet
                        ? "text-base"
                        : isTablet
                        ? "text-sm"
                        : "text-sm"
                    )}
                    style={{ color: getStatusColor(device.status) }}
                  >
                    {getStatusText(device.status)}
                  </Text>
                </View>
                <Pressable
                  className="bg-sky-800/20 rounded-xl border border-sky-800/20 px-5 py-2">
                  <Text
                    className="font-medium text-black/70 text-base"
                  >
                    Refresh
                  </Text>
                </Pressable>
              </View>
            </View>
            {index < devices.length - 1 && (
              <View className="h-px bg-[#e5e7eb]" />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderNotificationsView = () => (
    <View className="flex-1">
      <Text
        className="font-semibold mb-6 text-xl text-black/70 border-b border-black/10 pb-6"
      >
        Push Notifications
      </Text>

      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text
              className="font-semibold text-lg"
            >
              Device Offline
            </Text>
            <Text
              className="text-black/60 text-base"
            >
              Notify when a device goes offline
            </Text>
          </View>
          <Switch
            value={deviceOfflineNotif}
            onValueChange={setDeviceOfflineNotif}
          />
        </View>
      </View>

      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text
              className="font-semibold text-lg"
            >
              Valve Open/Close
            </Text>
            <Text
              className="text-black/60 text-base"
            >
              Notify when a valve is opened or closed
            </Text>
          </View>
          <Switch value={valveNotif} onValueChange={setValveNotif} />
        </View>
      </View>
    </View>
  );

  const renderSiteManagementView = () => (
    <View className="flex-1">
      <Text
        className="font-semibold mb-6 text-xl text-black/70 border-b border-black/10 pb-6"
      >
        Site Management
      </Text>

      <View className="mb-8">
        <Text className="text-[#676c77] font-medium text-sm">
          Current Site
        </Text>
        
        <View className="my-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sky-800 font-semibold text-lg">
                {sites.find(site => site.id === selectedSite)?.name}
              </Text>
              <Text className="text-sky-600 text-sm mt-1">
                {sites.find(site => site.id === selectedSite)?.location}
              </Text>
            </View>
            <Button
              onPress={() => setIsDropdownOpen(true)}
              className="bg-sky-800/20 rounded-xl border border-sky-800/20 px-4 py-2"
            >
              <Text className="text-black/70 font-regular">Change Site</Text>
            </Button>
          </View>
        </View>
      </View>


      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setIsDropdownOpen(false)}
        >
          <View className="bg-white rounded-2xl shadow-lg w-full max-w-sm">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900">Select Site</Text>
            </View>
            <ScrollView className="max-h-80">
              {sites.map((site, index) => (
                <Pressable
                  key={site.id}
                  className={cn(
                    "px-4 py-4 border-b border-gray-100",
                    selectedSite === site.id ? "bg-sky-50" : "bg-white"
                  )}
                  onPress={() => {
                    setSelectedSite(site.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text className={cn(
                    "font-medium text-base",
                    selectedSite === site.id ? "text-sky-800" : "text-gray-900"
                  )}>
                    {site.name}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {site.location}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View className="p-4 border-t border-gray-200">
              <Pressable
                className="bg-gray-100 rounded-xl py-3"
                onPress={() => setIsDropdownOpen(false)}
              >
                <Text className="text-center font-medium text-gray-700">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb]" edges={["top"]}>
      {/* Page Header (outside cards) */}
      <View
        className={cn(
          isLargeTablet ? "px-12 pt-10" : isTablet ? "px-10 pt-8" : "px-8 pt-8"
        )}
      >
        <Text className="text-slate-900 text-3xl mb-1">Settings</Text>
        <Text className="text-slate-600 text-base">
          Configure system preferences and parameters
        </Text>
      </View>
      <View className="flex-1 flex-row gap-3 mt-5 px-[60px]">
        {/* Sidebar */}
        <View
          className={cn(
            "bg-white rounded-2xl shadow-xs border border-[#e5e7eb]",
            isLargeTablet
              ? "w-[400px] my-6 px-5 pt-10"
              : isTablet
              ? "w-[360px] my-6 px-4 pt-8"
              : "w-[320px] my-6 px-4 pt-8"
          )}
        >
          <View className="space-y-3">
            <Pressable
              onPress={() => setSelectedView("account")}
              className={cn(
                "flex-row items-center rounded-2xl px-4 py-4 border border-transparent",
                selectedView === "account" ? "bg-sky-800/20 border-sky-800/20" : "bg-transparent"
              )}
            >
              <UserRound
                size={isLargeTablet ? 24 : isTablet ? 22 : 20}
                color="#2d3748"
              />
              <Text
                className={cn(
                  "font-medium ml-3",
                  isLargeTablet
                    ? "text-[#2d3748] text-lg"
                    : isTablet
                    ? "text-[#2d3748] text-base"
                    : "text-[#2d3748] text-base"
                )}
              >
                Account
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedView("devices")}
              className={cn(
                "flex-row items-center rounded-2xl px-4 py-4 border border-transparent",
                selectedView === "devices" ? "bg-sky-800/20 border-sky-800/20" : "bg-transparent"
              )}
            >
              <SettingsIcon
                size={isLargeTablet ? 24 : isTablet ? 22 : 20}
                color="#2d3748"
              />
              <Text
                className={cn(
                  "font-medium ml-3",
                  isLargeTablet
                    ? "text-[#2d3748] text-lg"
                    : isTablet
                    ? "text-[#2d3748] text-base"
                    : "text-[#2d3748] text-base"
                )}
              >
                Device Management
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedView("notifications")}
              className={cn(
                "flex-row items-center rounded-2xl px-4 py-4 border border-transparent",
                selectedView === "notifications"
                  ? "bg-sky-800/20 border-sky-800/20"
                  : "bg-transparent"
              )}
            >
              <Bell
                size={isLargeTablet ? 24 : isTablet ? 22 : 20}
                color="#2d3748"
              />
              <Text
                className={cn(
                  "font-medium ml-3",
                  isLargeTablet
                    ? "text-[#2d3748] text-lg"
                    : isTablet
                    ? "text-[#2d3748] text-base"
                    : "text-[#2d3748] text-base"
                )}
              >
                Notification
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedView("siteManagement")}
              className={cn(
                "flex-row items-center rounded-2xl px-4 py-4 border border-transparent",
                selectedView === "siteManagement"
                  ? "bg-sky-800/20 border-sky-800/20"
                  : "bg-transparent"
              )}
            >
              <MapPin
                size={isLargeTablet ? 24 : isTablet ? 22 : 20}
                color="#2d3748"
              />
              <Text
                className={cn(
                  "font-medium ml-3",
                  isLargeTablet
                    ? "text-[#2d3748] text-lg"
                    : isTablet
                    ? "text-[#2d3748] text-base"
                    : "text-[#2d3748] text-base"
                )}
              >
                Site Management
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Main Content */}
        <View
          className={cn(
            "flex-1 bg-white rounded-3xl shadow-xs border border-[#e5e7eb]",
            // isLargeTablet ? "m-12 p-16" : isTablet ? "m-10 p-14" : "m-8 p-12"

            isLargeTablet
              ? "my-6 px-10 pt-10"
              : isTablet
              ? "my-6 px-8 pt-8"
              : "my-6 px-8 pt-8"
          )}
        >
          {/* Page header removed from inside card */}
          {selectedView === "account" && renderAccountView()}
          {selectedView === "devices" && renderDevicesView()}
          {selectedView === "notifications" && renderNotificationsView()}
          {selectedView === "siteManagement" && renderSiteManagementView()}
        </View>
      </View>
    </SafeAreaView>
  );
}
