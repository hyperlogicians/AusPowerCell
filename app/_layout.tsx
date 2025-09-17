import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NativeWindStyleSheet } from 'nativewind';

export default function RootLayout() {
  // Ensure NativeWind outputs inline styles on web (no CSS pipeline required)
  NativeWindStyleSheet.setOutput({ web: 'native' });
  return (
    <>
      <StatusBar style="light" backgroundColor="#516679" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
