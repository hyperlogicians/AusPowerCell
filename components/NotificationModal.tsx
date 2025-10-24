import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { CircleCheckBig, Clock } from "lucide-react-native";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "error";
  isRead: boolean;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Sample notification data matching the reference image
const notifications: Notification[] = [
  {
    id: "1",
    title: "Irrigation Zone",
    message: "was turned on by 80%",
    time: "14:29",
    type: "success",
    isRead: false,
  },
  {
    id: "2",
    title: "Main Supply Line",
    message: "was turned off",
    time: "14:29",
    type: "success",
    isRead: false,
  },
  {
    id: "3",
    title: "Valve C",
    message: "is offline - check connection",
    time: "14:29",
    type: "error",
    isRead: false,
  },
];

export function NotificationModal({ visible, onClose }: NotificationModalProps) {
  const todayNotifications = notifications.slice(0, 2);
  const weekNotifications = notifications.slice(2);

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "#10b981"; // green-500
      case "warning":
        return "#f59e0b"; // amber-500
      case "error":
        return "#ef4444"; // red-500
      default:
        return "#6b7280"; // gray-500
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <View className="flex-row items-start mb-4">
      {/* Blue bullet point */}
      <View className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
      
      {/* Icon */}
      <View 
        className="mr-3 mt-1"
      >
        <CircleCheckBig size={20} color={getIconColor(notification.type)} />
      </View>
      
      {/* Content */}
      <View className="flex-1">
        <Text className="text-gray-900 text-base leading-5">
          <Text className="font-semibold text-sky-800">{notification.title}</Text>
          <Text className="text-gray-900"> {notification.message}</Text>
        </Text>
        
        {/* Timestamp */}
        <View className="flex-row items-center mt-1">
          <Clock size={12} color="#9ca3af" />
          <Text className="text-gray-500 text-xs ml-1">{notification.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      {/* Backdrop - no opacity */}
      <Pressable
        className="flex-1 items-start justify-start px-4 pt-20"
        onPress={onClose}
      >
        {/* Modal Content positioned under notification icon */}
        <Pressable
          className="bg-white rounded-2xl shadow-2xl"
          style={{
            width: Math.min(screenWidth - 32, 350),
            maxHeight: screenHeight * 0.7,
            position: 'absolute',
            top: 75,
            right: 80,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="px-6 pt-6 pb-4">
            <Text className="text-gray-900 text-2xl font-medium">
              Notifications
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-6 py-2" showsVerticalScrollIndicator={false}>
            {/* Today Section */}
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-medium mb-4">Today</Text>
              {todayNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </View>

            {/* This Week Section */}
            <View className="mb-2">
              <Text className="text-gray-900 text-lg font-medium mb-4">This Week</Text>
              {weekNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
