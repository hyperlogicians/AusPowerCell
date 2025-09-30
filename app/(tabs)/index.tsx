import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { cn } from "../../lib/utils";
import * as Haptics from "expo-haptics";
import {
  Activity,
  Zap,
  Gauge,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Settings,
  Play,
  Pause,
  MoreVertical,
  Droplets,
  Thermometer,
  BarChart3,
} from "lucide-react-native";
import { statusStore } from "../../lib/status";

interface SystemStats {
  totalValves: number;
  onlineValves: number;
  activeValves: number;
  alerts: number;
  avgPressure: number;
  temperature: number;
}

interface ValveData {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  isActive: boolean;
  pressure: number;
  flow: number;
  lastUpdate: Date;
  hasAlert?: boolean;
  percentage?: number;
  lastSetpoint?: number;
}

const initialValves: ValveData[] = [
  {
    id: "1",
    name: "Irrigation Zone A1",
    status: "online",
    isActive: true,
    pressure: 52.1,
    flow: 0,
    percentage: 50,
    lastSetpoint: 50,
    lastUpdate: new Date(),
    hasAlert: false,
  },
  {
    id: "2",
    name: "Main Supply Line",
    status: "online",
    isActive: false,
    pressure: 44.3,
    flow: 62,
    percentage: 0,
    lastSetpoint: 40,
    lastUpdate: new Date(),
    hasAlert: false,
  },
  {
    id: "3",
    name: "Irrigation Zone A2",
    status: "offline",
    isActive: false,
    pressure: 0,
    flow: 0,
    percentage: 0,
    lastSetpoint: 30,
    lastUpdate: new Date(Date.now() - 300000),
    hasAlert: false,
  },
  {
    id: "4",
    name: "Irrigation Zone B1",
    status: "maintenance",
    isActive: false,
    pressure: 0,
    flow: 0,
    percentage: 0,
    lastSetpoint: 25,
    lastUpdate: new Date(Date.now() - 600000),
  },
  {
    id: "5",
    name: "Relief Line",
    status: "online",
    isActive: true,
    pressure: 48.3,
    flow: 72,
    percentage: 75,
    lastSetpoint: 75,
    lastUpdate: new Date(),
  },
  {
    id: "6",
    name: "Service Loop",
    status: "online",
    isActive: false,
    pressure: 38.7,
    flow: 45,
    percentage: 25,
    lastSetpoint: 25,
    lastUpdate: new Date(),
    hasAlert: false,
  },
  {
    id: "7",
    name: "West Sector",
    status: "online",
    isActive: true,
    pressure: 41.2,
    flow: 58,
    percentage: 60,
    lastSetpoint: 60,
    lastUpdate: new Date(),
  },
  {
    id: "8",
    name: "North Sector",
    status: "online",
    isActive: false,
    pressure: 35.9,
    flow: 40,
    percentage: 0,
    lastSetpoint: 20,
    lastUpdate: new Date(),
  },
  {
    id: "9",
    name: "South Sector",
    status: "online",
    isActive: true,
    pressure: 55.0,
    flow: 90,
    percentage: 80,
    lastSetpoint: 80,
    lastUpdate: new Date(),
    hasAlert: false,
  },
  {
    id: "10",
    name: "East Sector",
    status: "online",
    isActive: false,
    pressure: 39.5,
    flow: 43,
    percentage: 10,
    lastSetpoint: 10,
    lastUpdate: new Date(),
  },
];

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [valves, setValves] = useState<ValveData[]>(initialValves);
  const [selectedValveId, setSelectedValveId] = useState<string>(
    initialValves[0]?.id || ""
  );
  const [filter, setFilter] = useState<
    "all" | "online" | "offline" | "error" | "on" | "off"
  >("all");
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (Platform.OS !== "web" && typeof Haptics.impactAsync === "function") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = "blue",
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: "up" | "down";
    color?: "blue" | "green" | "red" | "orange";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-100 text-blue-600",
      green: "bg-emerald-50 border-emerald-100 text-emerald-600",
      red: "bg-red-50 border-red-100 text-red-600",
      orange: "bg-orange-50 border-orange-100 text-orange-600",
    };

    return (
      <Card
        variant="subtle"
        size="lg"
        className="bg-white border border-slate-100"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-3">
              <View
                className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${colorClasses[color]}`}
              >
                <Icon size={24} color="currentColor" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-sm font-medium">
                  {title}
                </Text>
                <Text className="text-slate-900 text-2xl font-bold">
                  {value}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              {trend && (
                <View
                  className={`flex-row items-center mr-2 ${
                    trend === "up" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  <TrendingUp
                    size={14}
                    color="currentColor"
                    className={trend === "down" ? "rotate-180" : ""}
                  />
                </View>
              )}
              <Text className="text-slate-600 text-sm">{subtitle}</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const ValveCard = ({ valve }: { valve: ValveData }) => {
    const statusColors = {
      online: "bg-emerald-500",
      offline: "bg-red-500",
      maintenance: "bg-orange-500",
    };

    return (
      <Card
        variant="subtle"
        size="md"
        className={cn(
          "bg-white border",
          valve.hasAlert ? "border-red-200" : "border-slate-100",
          selectedValveId === valve.id && "ring-2 ring-emerald-400/60"
        )}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-slate-900 font-semibold text-lg">
              {valve.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  statusColors[valve.status]
                }`}
              />
              <Text className="text-slate-600 text-sm capitalize">
                {valve.status}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <Pressable
              className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center mr-2"
              onPress={() => {
                setValves((prev) =>
                  prev.map((v) =>
                    v.id === valve.id
                      ? {
                          ...v,
                          isActive: !v.isActive,
                          // preserve percentage; if turning on from 0, restore lastSetpoint or default 50
                          percentage:
                            !v.isActive && (v.percentage ?? 0) === 0
                              ? v.lastSetpoint ?? 50
                              : v.percentage,
                        }
                      : v
                  )
                );
              }}
            >
              {valve.isActive ? (
                <Pause size={16} color="#64748b" />
              ) : (
                <Play size={16} color="#64748b" />
              )}
            </Pressable>
            <Pressable
              className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center"
              onPress={() => setSelectedValveId(valve.id)}
            >
              <MoreVertical size={16} color="#64748b" />
            </Pressable>
          </View>
        </View>

        <View className="border-t border-slate-100 pt-3">
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Gauge size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1">Pressure</Text>
              </View>
              <Text className="text-slate-900 font-semibold">
                {valve.pressure} PSI
              </Text>
            </View>
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Droplets size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1">Flow</Text>
              </View>
              <Text className="text-slate-900 font-semibold">
                {valve.flow}%
              </Text>
            </View>
          </View>
        </View>

        {valve.hasAlert && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-2 mt-3">
            <View className="flex-row items-center">
              <AlertTriangle size={14} color="#dc2626" />
              <Text className="text-red-700 text-xs ml-2">
                System alert detected
              </Text>
            </View>
          </View>
        )}
      </Card>
    );
  };

  // Derived stats from current valves (demo computation)
  const computedStats: SystemStats = React.useMemo(() => {
    const total = valves.length;
    const online = valves.filter((v) => v.status === "online").length;
    const active = valves.filter((v) => v.isActive).length;
    const alerts = valves.filter((v) => v.hasAlert).length;
    const avgPressure =
      total > 0
        ? Math.round(
            (valves.reduce((s, v) => s + v.pressure, 0) / total) * 10
          ) / 10
        : 0;
    return {
      totalValves: total,
      onlineValves: online,
      activeValves: active,
      alerts,
      avgPressure,
      temperature: 72.5,
    };
  }, [valves]);

  const filteredValves = React.useMemo(() => {
    switch (filter) {
      case "online":
        return valves.filter((v) => v.status === "online");
      case "offline":
        return valves.filter((v) => v.status === "offline");
      case "error":
        return valves.filter((v) => v.hasAlert);
      case "on":
        return valves.filter((v) => v.isActive);
      case "off":
        return valves.filter((v) => !v.isActive);
      default:
        return valves;
    }
  }, [valves, filter]);

  const selectedValve = React.useMemo(
    () => valves.find((v) => v.id === selectedValveId) || valves[0],
    [valves, selectedValveId]
  );

  // Update health status for TopBar
  React.useEffect(() => {
    const total = valves.length;
    const online = valves.filter((v) => v.status === "online").length;
    const offline = total - online;
    const alerts = valves.filter((v) => v.hasAlert).length;
    // Simple heuristic: all online and no alerts => good; some offline/alerts => medium; many offline or any offline when total small => bad
    let health: "good" | "medium" | "bad" = "good";
    if (offline === 0 && alerts === 0) health = "good";
    else if (offline / total <= 0.2 && alerts <= 1) health = "medium";
    else health = "bad";
    statusStore.setHealth(health);
  }, [valves]);

  const Chip = ({
    label,
    count,
    active,
    onPress,
  }: {
    label: string;
    count?: number;
    active?: boolean;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className={cn(
        "px-3 py-2 rounded-full mr-2 mb-2 border",
        active ? "bg-blue-500 border-blue-400" : "bg-white border-slate-200"
      )}
    >
      <Text
        className={cn(
          "text-sm font-medium",
          active ? "text-white" : "text-slate-700"
        )}
      >
        {label}
        {typeof count === "number" ? ` ${count}` : ""}
      </Text>
    </Pressable>
  );

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
        <View className="py-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-slate-900 text-3xl font-bold mb-2">
              System Overview
            </Text>
            <Text className="text-slate-600 text-base">
              Monitor and control your valve infrastructure
            </Text>
          </View>

          {/* Stats Grid */}
          <View
            className={`mb-8 ${
              isTablet ? "flex-row flex-wrap -mx-2" : "space-y-4"
            }`}
          >
            <View className={isTablet ? "w-1/2 px-2 mb-4" : ""}>
              <StatCard
                icon={CheckCircle}
                title="Online Systems"
                value={computedStats.onlineValves}
                subtitle={`${computedStats.totalValves} total systems`}
                color="green"
                trend="up"
              />
            </View>
            <View className={isTablet ? "w-1/2 px-2 mb-4" : ""}>
              <StatCard
                icon={Activity}
                title="Active Valves"
                value={computedStats.activeValves}
                subtitle="Currently operating"
                color="blue"
              />
            </View>
            {/* Temperature card removed */}
            <View className={isTablet ? "w-1/2 px-2 mb-4" : ""}>
              <StatCard
                icon={AlertTriangle}
                title="Active Alerts"
                value={computedStats.alerts}
                subtitle="Require attention"
                color="red"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-slate-900 text-xl font-semibold mb-4">
              Quick Actions
            </Text>
            <View className="flex-row space-x-3">
              <Pressable
                className="flex-1 bg-blue-500 rounded-2xl p-4 items-center"
                onPress={() => {
                  setValves((prev) =>
                    prev.map((v) => ({ ...v, isActive: false }))
                  );
                }}
              >
                <Zap size={24} color="white" />
                <Text className="text-white font-semibold mt-2">
                  Emergency Stop
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-emerald-500 rounded-2xl p-4 items-center"
                onPress={() => {
                  setValves((prev) =>
                    prev.map((v) => ({ ...v, hasAlert: false }))
                  );
                }}
              >
                <Settings size={24} color="white" />
                <Text className="text-white font-semibold mt-2">
                  System Check
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-orange-500 rounded-2xl p-4 items-center"
                onPress={() => {}}
              >
                <BarChart3 size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Reports</Text>
              </Pressable>
            </View>
          </View>

          {/* Valves Grid with Filters and Detail Panel */}
          <View>
            <Text className="text-slate-900 text-xl font-semibold mb-4">
              Valves
            </Text>

            <View className="flex-row flex-wrap mb-4">
              <Chip
                label={`All Valves`}
                count={valves.length}
                active={filter === "all"}
                onPress={() => setFilter("all")}
              />
              <Chip
                label="Online"
                count={valves.filter((v) => v.status === "online").length}
                active={filter === "online"}
                onPress={() => setFilter("online")}
              />
              <Chip
                label="Offline"
                count={valves.filter((v) => v.status === "offline").length}
                active={filter === "offline"}
                onPress={() => setFilter("offline")}
              />
              <Chip
                label="Error"
                count={valves.filter((v) => v.hasAlert).length}
                active={filter === "error"}
                onPress={() => setFilter("error")}
              />
              <Chip
                label="On"
                count={valves.filter((v) => v.isActive).length}
                active={filter === "on"}
                onPress={() => setFilter("on")}
              />
              <Chip
                label="Off"
                count={valves.filter((v) => !v.isActive).length}
                active={filter === "off"}
                onPress={() => setFilter("off")}
              />
            </View>

            <View className={isTablet ? "flex-row -mx-2" : ""}>
              <View className={isTablet ? "w-1/2 px-2" : ""}>
                <View
                  className={
                    isTablet ? "flex-row flex-wrap -mx-2" : "space-y-4"
                  }
                >
                  {filteredValves.map((valve) => (
                    <View
                      key={valve.id}
                      className={isTablet ? "w-1/2 px-2 mb-4" : ""}
                    >
                      <Pressable onPress={() => setSelectedValveId(valve.id)}>
                        <ValveCard valve={valve} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>

              {/* Detail Panel */}
              <View className={isTablet ? "w-1/2 px-2 mt-0" : "mt-6"}>
                <Card
                  variant={selectedValve?.hasAlert ? "elevated" : "subtle"}
                  size="lg"
                  className={cn(
                    "bg-white border",
                    selectedValve?.hasAlert
                      ? "border-red-200"
                      : "border-slate-100"
                  )}
                >
                  <View className="mb-4">
                    <Text className="text-slate-900 text-xl font-semibold">
                      {selectedValve?.name}
                    </Text>
                    <Text className="text-slate-600 mt-1">
                      North Side, Sector 1
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-4">
                    <View className="items-center flex-1">
                      <Text className="text-slate-900 text-2xl font-bold">
                        {selectedValve?.percentage ?? 0}
                        <Text className="text-base">%</Text>
                      </Text>
                      <Text className="text-slate-600 text-xs mt-1">
                        Valve Open
                      </Text>
                    </View>
                    <View className="items-center flex-1">
                      <Text className="text-slate-900 text-2xl font-bold">
                        {selectedValve?.pressure}{" "}
                        <Text className="text-base">PSI</Text>
                      </Text>
                      <Text className="text-slate-600 text-xs mt-1">
                        Water Pressure
                      </Text>
                    </View>
                    <View className="items-center flex-1">
                      <Text className="text-slate-900 text-2xl font-bold">
                        {selectedValve?.flow ?? 0}
                        <Text className="text-base"> L/min</Text>
                      </Text>
                      <Text className="text-slate-600 text-xs mt-1">
                        Water Flow
                      </Text>
                    </View>
                  </View>

                  {/* Quick Presets */}
                  <View className="border rounded-2xl p-4 border-slate-200">
                    <View className="flex-row mb-3">
                      {[0, 50, 100].map((p) => (
                        <Pressable
                          key={p}
                          className={cn(
                            "px-3 py-1 rounded-lg mr-2 border",
                            (selectedValve?.percentage ?? 0) === p
                              ? "bg-blue-500 border-blue-400"
                              : "bg-white border-slate-200"
                          )}
                          onPress={() =>
                            setValves((prev) =>
                              prev.map((v) =>
                                v.id === selectedValveId
                                  ? {
                                      ...v,
                                      percentage: p,
                                      isActive:
                                        p > 0 ? true : v.isActive && false,
                                      lastSetpoint:
                                        p > 0 ? p : v.lastSetpoint ?? 50,
                                    }
                                  : v
                              )
                            )
                          }
                        >
                          <Text
                            className={cn(
                              "text-sm",
                              (selectedValve?.percentage ?? 0) === p
                                ? "text-white"
                                : "text-slate-700"
                            )}
                          >
                            {p}%
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* Simple donut visual substitute with text for now */}
                    <View className="items-center py-10">
                      <Text className="text-slate-600">
                        Setpoint: {selectedValve?.percentage ?? 0}%
                      </Text>
                    </View>
                  </View>

                  {/* Power Button */}
                  <View className="items-center mt-6">
                    <Pressable
                      className={cn(
                        "px-6 py-3 rounded-full border",
                        selectedValve?.isActive
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-300 bg-slate-50"
                      )}
                      onPress={() =>
                        setValves((prev) =>
                          prev.map((v) =>
                            v.id === selectedValveId
                              ? {
                                  ...v,
                                  isActive: !v.isActive,
                                  // When turning off, keep current percentage and remember it
                                  // When turning on and percentage is 0, restore lastSetpoint (or default 50)
                                  percentage: v.isActive
                                    ? v.percentage
                                    : (v.percentage ?? 0) === 0
                                    ? v.lastSetpoint ?? 50
                                    : v.percentage,
                                }
                              : v
                          )
                        )
                      }
                    >
                      <Text
                        className={cn(
                          "font-semibold",
                          selectedValve?.isActive
                            ? "text-emerald-600"
                            : "text-slate-700"
                        )}
                      >
                        {selectedValve?.isActive ? "ON" : "OFF"}
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
