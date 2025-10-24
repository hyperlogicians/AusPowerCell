import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  Platform,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { cn } from "../../lib/utils";
import * as Haptics from "expo-haptics";
import {
  UsersRound,
  UserRoundPlus,
  Eye,
  Activity,
  MonitorDot,
  Clock,
  Mail,
  Search,
  Crown,
  Wrench,
} from "lucide-react-native";

interface User {
  id: string;
  name: string;
  email: string;
  // role: 'admin' | 'operator' | 'viewer';
  role: "operator";
  department: string;
  lastLogin: Date;
  isOnline: boolean;
  actionsToday: number;
  totalActions: number;
  avatar?: string;
  location?: string;
  permissions: string[];
  isCurrentUser?: boolean;
}

const mockUsers: User[] = [
  {
    id: "0",
    name: "John Legend",
    email: "john.legend@auspowercell.com",
    role: "operator",
    department: "Operations",
    lastLogin: new Date(Date.now() - 60000),
    isOnline: true,
    actionsToday: 8,
    totalActions: 2156,
    location: "Control Room A",
    permissions: ["valve_control", "monitoring", "system_config"],
    isCurrentUser: true,
  },
  {
    id: "1",
    name: "Peter Griffen",
    email: "peter.griffen@auspowercell.com",
    role: "operator",
    department: "Operations",
    lastLogin: new Date(Date.now() - 360000),
    isOnline: true,
    actionsToday: 2,
    totalActions: 1547,
    location: "Control Room A",
    permissions: ["valve_control", "monitoring"],
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@apc.com",
    role: "operator",
    department: "Operations",
    lastLogin: new Date(Date.now() - 300000),
    isOnline: true,
    actionsToday: 24,
    totalActions: 1547,
    location: "Control Room A",
    permissions: ["valve_control", "monitoring"],
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@apc.com",
    role: "operator",
    department: "Field Operations",
    lastLogin: new Date(Date.now() - 1800000),
    isOnline: false,
    actionsToday: 18,
    totalActions: 892,
    location: "Field Station 1",
    permissions: ["valve_control", "monitoring"],
  },
  {
    id: "4",
    name: "Lisa Anderson",
    email: "lisa.anderson@apc.com",
    role: "operator",
    department: "Field Operations",
    lastLogin: new Date(Date.now() - 1800000),
    isOnline: false,
    actionsToday: 12,
    totalActions: 456,
    location: "Field Station 3",
    permissions: ["valve_control", "monitoring"],
  },
  {
    id: "5",
    name: "Maria Garcia",
    email: "maria.garcia@apc.com",
    role: "operator",
    department: "Maintenance",
    lastLogin: new Date(Date.now() - 900000),
    isOnline: false,
    actionsToday: 15,
    totalActions: 723,
    location: "Field Station 4",
    permissions: ["maintenance", "monitoring"],
  },
  {
    id: "6",
    name: "Mike Davis",
    email: "mike.davis@apc.com",
    role: "operator",
    department: "Maintenance",
    lastLogin: new Date(Date.now() - 3600000),
    isOnline: false,
    actionsToday: 7,
    totalActions: 634,
    location: "Field Station 2",
    permissions: ["maintenance", "monitoring"],
  },
  {
    id: "7",
    name: "Emily Chen",
    email: "emily.chen@apc.com",
    role: "operator",
    department: "Quality Assurance",
    lastLogin: new Date(Date.now() - 7200000),
    isOnline: false,
    actionsToday: 0,
    totalActions: 156,
    permissions: ["monitoring"],
  },
  {
    id: "8",
    name: "Robert Brown",
    email: "robert.brown@apc.com",
    role: "operator",
    department: "Quality Assurance",
    lastLogin: new Date(Date.now() - 14400000),
    isOnline: false,
    actionsToday: 0,
    totalActions: 89,
    permissions: ["monitoring"],
  },
  {
    id: "9",
    name: "David Wilson",
    email: "david.wilson@apc.com",
    role: "operator",
    department: "IT Administration",
    lastLogin: new Date(Date.now() - 86400000),
    isOnline: false,
    actionsToday: 0,
    totalActions: 2341,
    permissions: ["system_config", "user_management"],
  },
];

type FilterType = "all" | "online" | "admin" | "operator" | "viewer";

export default function UsersPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (Platform.OS !== "web" && typeof Haptics.impactAsync === "function") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const filteredUsers = mockUsers
    .filter((user) => {
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Current user always first
      if (a.isCurrentUser && !b.isCurrentUser) return -1;
      if (!a.isCurrentUser && b.isCurrentUser) return 1;
      // Then sort by online status (online users at top)
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      // Finally sort by name alphabetically
      return a.name.localeCompare(b.name);
    });

  const getRoleIcon = (role: string) => {
    switch (role) {
      // case 'admin': return <Crown size={16} color="#dc2626" />;
      case "operator":
        return <Wrench size={16} color="#2563eb" />;
      // case 'viewer': return <Eye size={16} color="#64748b" />;
      // default: return <UsersRound size={16} color="#64748b" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      // case 'admin': return 'bg-red-50 border-red-200 text-red-700';
      case "operator":
        return "bg-blue-50 border-blue-200 text-blue-700";
      // case 'viewer': return 'bg-slate-50 border-slate-200 text-slate-700';
      // default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getLastLoginText = (lastLogin: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  const FilterButton = ({
    type,
    label,
    count,
  }: {
    type: FilterType;
    label: string;
    count: number;
  }) => (
    <Pressable
      onPress={() => setFilter(type)}
      className={cn(
        "px-4 py-2 rounded-xl border transition-all duration-200",
        filter === type
          ? "bg-blue-500 border-blue-500"
          : "bg-white border-slate-200"
      )}
    >
      <View className="flex-row items-center">
        <Text
          className={cn(
            "font-medium text-sm",
            filter === type ? "text-white" : "text-slate-700"
          )}
        >
          {label}
        </Text>
        <View
          className={cn(
            "ml-2 px-2 py-0.5 rounded-full",
            filter === type ? "bg-white/20" : "bg-slate-100"
          )}
        >
          <Text
            className={cn(
              "text-xs font-semibold",
              filter === type ? "text-white" : "text-slate-600"
            )}
          >
            {count}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const UserCard = ({ user }: { user: User }) => (
    <Card
      variant="subtle"
      size="lg"
      className="bg-white border border-slate-300 mb-4"
    >
      <View className="flex-col items-start">
        <View className="flex-row">
          {/* Avatar with Status Dot */}
          <View className="relative mr-4">
            <View className="w-12 h-12 rounded-xl bg-slate-100 items-center justify-center">
              <Text className="text-slate-700 font-semibold text-base">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                user.isOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          </View>
           {/* User Info */}
           <View className="flex-1">
             <View className="flex-row items-center mb-2">
               <Text className="text-slate-900 font-semibold text-lg">
                 {user.name}
               </Text>
               {user.isCurrentUser && (
                 <View className="ml-2 px-2 py-0.5 bg-sky-600/70 rounded-lg">
                   <Text className="text-white text-xs font-semibold">Me</Text>
                 </View>
               )}
             </View>
             <View className="flex-row items-center mb-2">
               <Mail size={14} color="#64748b" />
               <Text className="text-slate-600 text-sm ml-2">{user.email}</Text>
             </View>
             <View className="flex-row items-center mb-4">
               <View
                 className={`px-3 py-1 rounded-full border ${getRoleColor(
                   user.role
                 )}`}
               >
                 <View className="flex-row items-center">
                   {getRoleIcon(user.role)}
                   <Text className="text-xs font-semibold ml-1 capitalize">
                     {user.role}
                   </Text>
                 </View>
               </View>
             </View>
           </View>
        </View>

        <View className="border-t border-slate-100 pt-3 w-full items-center">
          <View className="flex-row justify-between w-full">
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Clock size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1">Last Login</Text>
              </View>
              <Text className="text-slate-900 font-semibold text-sm">
                {getLastLoginText(user.lastLogin)}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Activity size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1">Today</Text>
              </View>
              <Text className="text-slate-900 font-semibold text-sm">
                {user.actionsToday} Actions
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  const onlineUsers = mockUsers.filter((u) => u.isOnline).length;
  const totalUsers = mockUsers.length;
  const totalActions = mockUsers.reduce((sum, u) => sum + u.actionsToday, 0);

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#64748b"
            colors={["#64748b"]}
          />
        }
      >
        <View className="py-10">
          {/* Header */}
          <View>
            <View className="flex-row items-start justify-between mb-6">
              <View className="flex-1">
                <Text className="text-slate-900 text-3xl mb-1">
                  User Management
                </Text>
                <Text className="text-slate-600 text-base">
                  Manage user access and monitor team activity
                </Text>
              </View>

              <View className="flex-col gap-3">
                <View>
                  {/* Summary Cards */}
                  <View className="flex-row space-x-3">
                    <Card
                      variant="subtle"
                      size="sm"
                      className="bg-blue-50 border-blue-300 rounded-2xl shadow-none px-6 pt-0 pb-1 items-center justify-center"
                    >
                      <View className="items-center flex-row gap-5">
                        <UsersRound size={20} color="#3b82f6" />
                         <View className="flex-col items-center">
                           <Text className="text-blue-900 text-4xl mt-1">
                             {totalUsers}
                           </Text>
                           <Text className="text-blue-700 text-xs">
                             Total Users
                           </Text>
                         </View>
                      </View>
                    </Card>

                    <Card
                      variant="subtle"
                      size="sm"
                      className="bg-emerald-50 border-emerald-300 rounded-2xl shadow-none px-6 pt-0 pb-1 items-center justify-center"
                    >
                      <View className="items-center flex-row gap-5">
                        <MonitorDot size={20} color="#10b981" />
                         <View className="flex-col items-center">
                           <Text className="text-emerald-900 text-4xl mt-1">
                             {onlineUsers}
                           </Text>
                           <Text className="text-emerald-700 text-xs">
                             Active Users
                           </Text>
                         </View>
                      </View>
                    </Card>

                    {/* <Pressable className="w-[70px] rounded-2xl bg-blue-500 items-center justify-center">
                      <UserRoundPlus size={24} color="white" />
                    </Pressable> */}
                  </View>
                </View>
                 {/* Search Bar */}
                 <View className="bg-white border border-slate-400 rounded-2xl px-4 py-3 flex-row items-center">
                   <Search size={20} color="#64748b" />
                   <TextInput
                     className="text-slate-900 text-base ml-3 flex-1 focus:outline-none focus:ring-0"
                     placeholder="Search User, role..."
                     placeholderTextColor="#64748b"
                     value={searchQuery}
                     onChangeText={setSearchQuery}
                   />
                 </View>
              </View>
            </View>
          </View>

          {/* Users List */}
          <View>
             <Text className="text-slate-900 text-xl mb-6">
               Users {filteredUsers.length}
             </Text>

            <View className="flex-row flex-wrap -mx-2">
              {filteredUsers.map((user) => (
                <View key={user.id} className="w-1/3 px-2">
                  <UserCard user={user} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
