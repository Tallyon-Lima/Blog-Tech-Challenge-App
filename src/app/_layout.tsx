import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Mantém a splash visível até a sessão salva ser lida do armazenamento
SplashScreen.preventAutoHideAsync();

function Navegacao() {
  const { autenticado, carregando } = useAuth();

  if (!carregando) {
    SplashScreen.hide();
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Área logada (menu lateral): só para quem está autenticado */}
      <Stack.Protected guard={autenticado}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      {/* Login: só para quem ainda não está autenticado */}
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
