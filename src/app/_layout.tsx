import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function Navegacao() {
  const { autenticado, carregando } = useAuth();

  if (!carregando) {
    SplashScreen.hide();
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={autenticado}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!autenticado}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <Navegacao />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
