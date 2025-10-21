import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Slot } from 'expo-router';
import { Sidebar, sidebarItems } from '../../components/ui/Sidebar';
import { TopBar } from '../../components/ui/TopBar';
import { GradientBackground } from '../../components/ui/GradientBackground';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const [sidebarExpanded, setSidebarExpanded] = useState(width >= 1024);
  
  const isTablet = width >= 768;
  
  return (
    <GradientBackground>
      <View className="flex-1">
        {/* Top Bar (transparent, over gradient) */}
        <TopBar />
        
        {/* Bottom Row: Sidebar and Main Content */}
        <View className="flex-1 flex-row">
          {/* Sidebar */}
          <Sidebar 
            items={sidebarItems}
            isExpanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          />

          {/* Main Area */}
          <View className="flex-1">
            {/* Content Container: grayish white with rounded edges */}
            <View className="flex-1 pr-4 pb-4">
              <View className="flex-1 rounded-3xl bg-[#F7F8FA] overflow-hidden">
                <Slot />
              </View>
            </View>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}
