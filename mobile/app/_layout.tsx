import "../global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/providers/AuthProvider";
import Toast from "react-native-toast-message";
import { AppProvider } from "@/providers/AppProvider";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack 
              screenOptions={{ 
                headerShown: false
              }} 
            />
            <Toast />
          </ThemeProvider>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
