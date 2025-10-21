import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, ImageBackground } from 'react-native';
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
          <View className="flex-1 flex-row">
            {/* Left Side - Login Form (50%) */}
            <View className="flex-1 w-1/2">
              <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View className="flex-1 justify-center px-6 py-8">
                  <View className="items-center mb-4">

                <View className="flex-1 mb-2">
                  <Image
                    source={require('../../public/apclogo.png')}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
                    <Text className="text-white text-3xl font-light text-center tracking-wide mb-1">
                      AusPowerCell
                    </Text>
                    <Text className="text-white/50 text-lg text-center font-light">
                      Valves Control System
                    </Text>
                  </View>

                  <Card variant="premium2" size="xl" className="mb-8 px-28">
                    <div className="flex flex-col">
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
                      
                      <TouchableOpacity className="flex items-end w-full mt-3 px-3">
                        <Text className="text-white/70 text-sm">
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>

                      <Button
                    onPress={handleLogin}
                    loading={loading}
                    className="my-4 rounded-3xl py-6"
                    size="lg"
                  >
                    Sign In
                  </Button>

                  {/* <View className="flex-row justify-center items-center">
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
                  </View> */}
                    </div>
                  </Card>

                  
                </View>
              </ScrollView>
            </View>

            {/* Right Side - Mines Background with APC Logo (50%) */}
            <View className="flex-1 w-1/2">
              <ImageBackground
                source={require('../../public/apcbg.webp')}
                className="w-full h-full"
                resizeMode="cover"
              >
                <View className="flex-1 justify-end items-center pb-8">
                  <Image
                    source={require('../../public/apclogo.png')}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
