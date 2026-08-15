import AppTabs from "@/components/app-tabs";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.profile.registrationComplete) {
    return <Redirect href="/onboarding-check" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="(screens)" />
      <Stack.Screen name="event" />
    </Stack>
  );
}