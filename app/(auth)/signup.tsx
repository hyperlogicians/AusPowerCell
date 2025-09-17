import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import * as Haptics from 'expo-haptics';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }, 2000);
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
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-4">
                  <Text className="text-2xl">⚡</Text>
                </View>
                <Text className="text-white text-2xl font-bold text-center">
                  Create Account
                </Text>
                <Text className="text-white/70 text-base text-center mt-1">
                  Join AusPowerCell today
                </Text>
              </View>

              <Card variant="glass" className="mb-6">
                <View className="space-y-4">
                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <Input
                        label="First Name"
                        placeholder="John"
                        value={formData.firstName}
                        onChangeText={(value) => updateField('firstName', value)}
                        autoCapitalize="words"
                        error={errors.firstName}
                      />
                    </View>
                    <View className="flex-1">
                      <Input
                        label="Last Name"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChangeText={(value) => updateField('lastName', value)}
                        autoCapitalize="words"
                        error={errors.lastName}
                      />
                    </View>
                  </View>
                  
                  <Input
                    label="Email Address"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChangeText={(value) => updateField('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={errors.email}
                  />
                  
                  <Input
                    label="Password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChangeText={(value) => updateField('password', value)}
                    secureTextEntry
                    autoComplete="new-password"
                    error={errors.password}
                  />
                  
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateField('confirmPassword', value)}
                    secureTextEntry
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                  />
                </View>
              </Card>

              <Button
                onPress={handleSignup}
                loading={loading}
                className="mb-6"
                size="lg"
              >
                Create Account
              </Button>

              <View className="flex-row justify-center items-center">
                <Text className="text-white/70 text-base">
                  Already have an account?{' '}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text className="text-blue-400 font-semibold text-base">
                      Sign In
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
