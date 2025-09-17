import React from 'react';
import { Image, Platform, View } from 'react-native';

interface LogoProps {
  size?: number; // height in px
  width?: number; // width in px (RN Web requires explicit width)
  className?: string;
}

export function Logo({ size = 28, width = 140, className }: LogoProps) {
  const height = size;
  return (
    <View className={className} style={{ height, width }}>
      {Platform.OS === 'web' ? (
        <Image
          source={{ uri: '/logo.png' }}
          style={{ height, width }}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={require('../assets/logo.png')}
          style={{ height, width }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}


