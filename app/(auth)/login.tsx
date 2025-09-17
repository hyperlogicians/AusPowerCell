import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Hardcoded test account
  const TEST_EMAIL = 'test@apc.local';
  const TEST_PASSWORD = 'apc12345';

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      if (Platform.OS !== 'web' && typeof Haptics.notificationAsync === 'function') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    setLoading(true);
    if (Platform.OS !== 'web' && typeof Haptics.impactAsync === 'function') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Hardcoded credential check
    if (email.trim().toLowerCase() === TEST_EMAIL && password === TEST_PASSWORD) {
      setLoading(false);
      if (Platform.OS !== 'web' && typeof Haptics.notificationAsync === 'function') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace('/(tabs)');
      return;
    }

    // Invalid credentials
    setLoading(false);
    setErrors({ password: 'Invalid email or password (use test account)' });
    if (Platform.OS !== 'web' && typeof Haptics.notificationAsync === 'function') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center px-6 py-8">
              <View className="items-center mb-16">
                <View className="w-28 h-28 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl items-center justify-center mb-8 border border-white/20 shadow-2xl shadow-black/20">
                  <Text className="text-5xl">⚡</Text>
                </View>
                <Text className="text-white text-5xl font-light text-center tracking-wide mb-3">
                  AusPowerCell
                </Text>
                <Text className="text-white/50 text-xl text-center font-light">
                  Valves Control System
                </Text>
              </View>

              <Card variant="premium" size="xl" className="mb-8">
                <View className="space-y-4">
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={errors.email}
                  />
                  
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    error={errors.password}
                  />
                  
                  <TouchableOpacity className="self-end mt-2">
                    <Text className="text-white/70 text-sm">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>

              <Button
                onPress={handleLogin}
                loading={loading}
                className="mb-6"
                size="lg"
              >
                Sign In
              </Button>

              <View className="flex-row justify-center items-center">
                <Text className="text-white/70 text-base">
                  Don't have an account?{' '}
                </Text>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity>
                    <Text className="text-blue-400 font-semibold text-base">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
