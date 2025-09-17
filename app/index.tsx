import { Redirect } from 'expo-router';
import { GradientBackground } from '../components/ui/GradientBackground';

export default function Index() {
  // In a real app, you would check authentication state here
  const isAuthenticated = false;

  return (
    <GradientBackground>
      <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />
    </GradientBackground>
  );
}
