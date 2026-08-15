import "../global.css";
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/providers/AuthProvider";
import Toast, { ErrorToast, SuccessToast, } from "react-native-toast-message";
import { AppProvider } from "@/providers/AppProvider";
import { useAuthStore } from "@/stores/auth.store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Font } from "@/constants/utils";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const toastConfig = {
  success: (props: any) => (
    <SuccessToast
      {...props}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
      style={{
        height: "auto",
        minHeight: 60,
        borderLeftColor: "green",
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{
        paddingVertical: 10,
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontFamily: Font.semiBold,
        fontSize: 14,
      }}
      text2Style={{
        fontFamily: Font.regular,
        fontSize: 13,
        flexWrap: "wrap",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
      style={{
        height: "auto",
        minHeight: 60,
        borderLeftColor: "red",
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{
        paddingVertical: 10,
        paddingHorizontal: 15
      }}
      text1Style={{
        fontFamily: Font.semiBold,
        fontSize: 14,
      }}
      text2Style={{
        fontFamily: Font.regular,
        fontSize: 13,
        flexWrap: "wrap",
      }}
    />
  ),
};

function RootNavigator() {
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

  const registrationComplete =
    user?.profile.registrationComplete === true;

    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected
          guard={Boolean(user) && !registrationComplete}
        >
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        <Stack.Protected
          guard={Boolean(user) && registrationComplete}
        >
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
    );
}

function AppContent() {
  const isAuthLoading = useAuthStore(
    (state) => state.isLoading
  );

  const [fontsLoaded, fontError] = useFonts({
    "RethinkSans": require("../assets/fonts/static/RethinkSans-Regular.ttf"),
    "RethinkSans-SemiBold": require("../assets/fonts/static/RethinkSans-SemiBold.ttf"),
    "RethinkSans-Bold": require("../assets/fonts/static/RethinkSans-Bold.ttf"),
    "RethinkSans-ExtraBold": require("../assets/fonts/static/RethinkSans-ExtraBold.ttf"),
    "RethinkSans-Medium": require("../assets/fonts/static/RethinkSans-Medium.ttf")
  });

  const fontsReady = fontsLoaded || Boolean(fontError);
  const appReady = fontsReady && !isAuthLoading;

  useEffect(() => {
    if (!appReady) {
      return;
    }

    SplashScreen.hideAsync().catch((error) => {
      console.error("Unable to hide splash screen:", error);
    });
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <>
      <RootNavigator />
      <Toast config={toastConfig}/>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </AppProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
