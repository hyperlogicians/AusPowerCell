import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  Platform,
  Pressable,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { ValveCard, Valve } from "../../components/ValveCard";
import { cn } from "../../lib/utils";
import * as Haptics from "expo-haptics";
import Svg, { G, Circle as SvgCircle, Path, Line } from "react-native-svg";
import {
  Gauge,
  TrendingUp,
  Droplets,
  Clock,
  MapPin,
  CirclePower,
  Power,
} from "lucide-react-native";
import { statusStore } from "../../lib/status";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BreastPumpIcon } from "@hugeicons/core-free-icons";

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
  location?: string;
  flowRate?: number;
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
    location: "North Side, Sector 1",
    flowRate: 0,
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
    location: "Ground, Sector 12",
    flowRate: 62,
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
    location: "North Side, Sector 2",
    flowRate: 0,
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
    hasAlert: true,
    location: "South Side, Sector 3",
    flowRate: 0,
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
    location: "Central, Sector 5",
    flowRate: 72,
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
    location: "East Side, Sector 8",
    flowRate: 45,
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
    location: "West Side, Sector 4",
    flowRate: 58,
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
    location: "North Side, Sector 6",
    flowRate: 40,
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
    location: "South Side, Sector 7",
    flowRate: 90,
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
    location: "East Side, Sector 9",
    flowRate: 43,
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
      blue: "bg-sky-50 border-sky-100 text-sky-600",
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
                className={`w-12 h-12 items-center justify-center mr-3 ${colorClasses[color]}`}
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

  // Convert ValveData to Valve format for the new ValveCard component
  const convertToValve = (valveData: ValveData): Valve => ({
    id: valveData.id,
    name: valveData.name,
    isOnline: valveData.status === "online",
    isOpen: valveData.isActive,
    percentage: valveData.percentage || 0,
    lastUpdate: valveData.lastUpdate,
    hasAlert: valveData.hasAlert,
    location: valveData.location,
    pressure: valveData.pressure,
    flowRate: valveData.flowRate,
    status: valveData.status === "maintenance" ? "error" : valveData.status,
  });

  const handleValveToggle = (id: string, isOpen: boolean) => {
    setValves((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              isActive: isOpen,
              percentage:
                isOpen && (v.percentage ?? 0) === 0
                  ? v.lastSetpoint ?? 50
                  : v.percentage,
            }
          : v
      )
    );
  };

  const handlePercentageChange = (id: string, percentage: number) => {
    setValves((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              percentage,
              isActive: percentage > 0,
              lastSetpoint: percentage,
            }
          : v
      )
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
        "px-3 py-2 rounded-2xl mr-2 mb-2 border",
        active ? "bg-sky-800/70 border-sky-700/70" : "bg-white border-slate-200"
      )}
    >
      <Text
        className={cn(
          "text-sm font-medium",
          active ? "text-white" : "text-slate-700"
        )}
      >
        {label}
        <span style={{ opacity: 0.75, fontWeight: 'normal' }}>{typeof count === "number" ? ` ${count}` : ""}</span>
      </Text>
    </Pressable>
  );

  // Circular Slider Component
  const CircularSlider = ({
    value,
    onValueChange,
    size = 160,
    strokeWidth = 12,
  }: {
    value: number;
    onValueChange: (value: number) => void;
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const knobSize = 24;
    const knobRadius = knobSize / 2;
    const cx = size / 2;
    const cy = size / 2;

    // Convert angle (deg) to cartesian point on circle
    const polarToCartesian = (
      centerX: number,
      centerY: number,
      r: number,
      angleInDegrees: number
    ) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + r * Math.cos(angleInRadians),
        y: centerY + r * Math.sin(angleInRadians),
      };
    };

    // SVG Arc path from 0 to value angle
    const describeArc = (x: number, y: number, r: number, endAngle: number) => {
      const start = polarToCartesian(x, y, r, 0);
      const end = polarToCartesian(x, y, r, endAngle);
      const largeArcFlag = endAngle <= 180 ? "0" : "1";
      return [
        "M",
        start.x,
        start.y,
        "A",
        r,
        r,
        0,
        largeArcFlag,
        1,
        end.x,
        end.y,
      ].join(" ");
    };

    const currentAngle = (value / 100) * 360;
    const knobPoint = polarToCartesian(cx, cy, radius, currentAngle);

    const setFromGesture = (locationX: number, locationY: number) => {
      const dx = locationX - cx;
      const dy = locationY - cy;
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // start from top
      if (deg < 0) deg += 360;
      const pct = Math.max(0, Math.min(100, Math.round((deg / 360) * 100)));
      onValueChange(pct);
    };

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          if (
            Platform.OS !== "web" &&
            typeof Haptics.impactAsync === "function"
          ) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          setFromGesture(locationX, locationY);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          setFromGesture(locationX, locationY);
        },
      })
    ).current;

    // Tick marks like a volume knob
    const ticks = Array.from({ length: 40 }).map((_, i) => {
      const angle = (i / 40) * 360;
      const inner = polarToCartesian(cx, cy, radius - 8, angle);
      const outer = polarToCartesian(cx, cy, radius, angle);
      return (
        <Line
          key={i}
          x1={inner.x}
          y1={inner.y}
          x2={outer.x}
          y2={outer.y}
          stroke="#cbd5e1"
          strokeWidth={2}
        />
      );
    });

    return (
      <View className="items-center">
        <View
          style={{ width: size, height: size }}
          {...panResponder.panHandlers}
        >
          <Svg width={size} height={size}>
            <G>
              {/* Base circle */}
              <SvgCircle
                cx={cx}
                cy={cy}
                r={radius}
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Ticks */}
              {ticks}
              {/* Progress arc synced with knob (full circle at 100%) */}
              {value >= 100 ? (
                <SvgCircle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  stroke="#4C88A7"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
              ) : value > 0 ? (
                <Path
                  d={describeArc(cx, cy, radius, currentAngle)}
                  stroke="#4C88A7"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              ) : null}
            </G>
          </Svg>
        </View>
        {/* Center value overlay */}
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
          pointerEvents="none"
        >
          <Text className="text-slate-900 text-2xl font-bold">{value}%</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <View className="flex-1 flex-row">
        {/* Left Side - Valve Grid (60% width) */}
        <View className="flex-1" style={{ width: "60%" }}>
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
              <View className="mb-8">
                <Text className="text-slate-900 text-3xl mb-1">Valves</Text>
                <Text className="text-slate-600 text-base">
                  Valves monitor and control center
                </Text>
              </View>

              {/* Filter Chips */}
              <View className="flex-row flex-wrap mb-6">
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

              {/* Valve Grid */}
              <View className="flex-row flex-wrap -mx-2">
                {filteredValves.map((valve) => (
                  <View key={valve.id} className="w-1/2 px-2 mb-4">
                    <Pressable onPress={() => setSelectedValveId(valve.id)}>
                      <ValveCard
                        valve={convertToValve(valve)}
                        onToggle={handleValveToggle}
                        onPercentageChange={handlePercentageChange}
                        isSelected={valve.id === selectedValveId}
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Right Side - Fixed Detail Panel (40% width) */}
        <View className="py-5 pr-5" style={{ width: "40%" }}>
          <Card
            variant={selectedValve?.hasAlert ? "elevated" : "subtle"}
            size="lg"
            className={cn(
              "bg-gradient-to-b from-white via-sky-100 to-sky-800/80 border rounded-3xl h-full",
              selectedValve?.hasAlert ? "border-red-200" : "border-slate-400"
            )}
          >
            {/* Header Section with Icon, Title, ID and Status */}
            <View className="p-6">
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                  {/* Icon and Title */}
                  <View className="flex-row items-center mb-2">
                    <View className="rotate-180 mr-3">
                      <HugeiconsIcon
                        icon={BreastPumpIcon}
                        size={62}
                        color="green"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-900 font-semibold text-3xl mb-1">
                        {selectedValve?.name}
                      </Text>
                      <Text className="text-slate-600 text-sm">APC-20N-02</Text>
                    </View>
                  </View>

                  {/* Status */}
                  <View className="flex-row items-center justify-between mb-3">
                    {/* Location */}
                    <View className="flex-row items-center mt-6">
                      <MapPin size={20} color="gray" />
                      <Text className="text-gray-600 text-sm ml-2">
                        {selectedValve?.location || "North Side, Sector 1"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      <Text className="text-green-600 text-sm font-medium">
                        Online
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Separator Line */}
              <View className="h-px bg-slate-200 mb-4" />

              {/* Key Metrics Section */}
              <View className="flex-row justify-between mb-6">
                <View className="items-center flex-1">
                  <Clock size={24} color="black" className="opacity-75" />
                  <Text className="text-slate-900 text-2xl font-medium mt-2">
                    {selectedValve?.percentage ?? 0} <span style={{ fontSize: 16, opacity: 0.75, fontWeight: 'normal' }}>%</span>
                  </Text>
                  <Text className="text-slate-600 text-xs mt-1">
                    Valve Open
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Gauge size={24} color="black" className="opacity-75" />
                  <Text className="text-slate-900 text-2xl font-medium mt-2">
                    {selectedValve?.pressure || 0} <span style={{ fontSize: 16, opacity: 0.75, fontWeight: 'normal' }}>PSI</span>
                  </Text>
                  <Text className="text-slate-600 text-xs mt-1">
                    Water Pressure
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Droplets size={24} color="black" className="opacity-75" />
                  <Text className="text-slate-900 text-2xl font-medium mt-2">
                    {selectedValve?.flowRate || 0} <span style={{ fontSize: 16, opacity: 0.75, fontWeight: 'normal' }}>L/min</span>
                  </Text>
                  <Text className="text-slate-600 text-xs mt-1">
                    Water Flow
                  </Text>
                </View>
              </View>

              {/* Circular Slider Section */}
              <View className="bg-white border border-slate-400 rounded-3xl p-6 mb-6">
                {/* Presets */}
                <View className="flex-row mb-4">
                  {[0, 25, 50, 75, 100].map((p) => (
                    <Pressable
                      key={p}
                      className={cn(
                        "px-3 py-1 rounded-lg mr-2 border",
                        (selectedValve?.percentage ?? 0) === p
                          ? "bg-sky-800/70 border-sky-700/70"
                          : "bg-black/5 border-slate-200"
                      )}
                      onPress={() =>
                        setValves((prev) =>
                          prev.map((v) =>
                            v.id === selectedValveId
                              ? {
                                  ...v,
                                  percentage: p,
                                  isActive: p > 0,
                                  lastSetpoint: p,
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

                {/* Interactive Circular Slider */}
                <View className="items-center py-8">
                  <CircularSlider
                    value={selectedValve?.percentage ?? 0}
                    onValueChange={(newValue) => {
                      setValves((prev) =>
                        prev.map((v) =>
                          v.id === selectedValveId
                            ? {
                                ...v,
                                percentage: newValue,
                                isActive: newValue > 0,
                                lastSetpoint: newValue,
                              }
                            : v
                        )
                      );
                    }}
                    size={170}
                    strokeWidth={25}
                  />
                </View>
              </View>

              {/* Power Button */}
              <View className="items-center">
                <Pressable
                  className={cn(
                    "w-16 h-16 rounded-full items-center justify-center mb-2",
                    selectedValve?.isActive ? "bg-green-500" : "bg-slate-300"
                  )}
                  onPress={() =>
                    setValves((prev) =>
                      prev.map((v) =>
                        v.id === selectedValveId
                          ? {
                              ...v,
                              isActive: !v.isActive,
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
                  <Power
                    size={34}
                    color={selectedValve?.isActive ? "white" : "gray"}
                  />
                </Pressable>
                <Text
                  className={cn(
                    "font-semibold text-lg",
                    selectedValve?.isActive
                      ? "text-green-600"
                      : "text-slate-600"
                  )}
                >
                  {selectedValve?.isActive ? "ON" : "OFF"}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
