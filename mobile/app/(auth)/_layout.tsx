import { Redirect, Stack, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/stores/auth.store";

const onboardingRoutes = [
  "onboarding-first",
  "onboarding-second",
  "onboarding-third",
  "onboarding-fourth",
  "onboarding-fifth",
];

export default function AuthLayout() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const segments = useSegments();

  const currentRoute = segments[segments.length - 1];
  const isOnboardingRoute = onboardingRoutes.includes(currentRoute);

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

  if (user?.profile.registrationComplete) {
    return <Redirect href="/home" />;
  }

  if (user && !user.profile.registrationComplete && !isOnboardingRoute) {
    return <Redirect href="/onboarding-check" />;
  }

  if (!user && isOnboardingRoute) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}