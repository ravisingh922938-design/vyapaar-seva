import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ title: 'Patna Hub Dashboard' }} />
      <Stack.Screen name="register" options={{ title: 'New Seller Registration' }} />
    </Stack>
  );
}