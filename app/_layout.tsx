import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import { ConnectionStatusIndicator } from "@/components/ConnectionStatusIndicator";
import { OfflineProgressProvider } from "@/contexts/OfflineProgressContext";
import { useOfflineTracker } from "@/hooks/useOfflineTracker";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useOfflineTracker();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <OfflineProgressProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <ConnectionStatusIndicator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </OfflineProgressProvider>
  );
}
