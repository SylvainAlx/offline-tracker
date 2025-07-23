import { OfflineProgressProvider } from "@/contexts/OfflineProgressContext";
import { useSession } from "@/contexts/SessionContext";
import { useSyncSession } from "@/hooks/useSyncSession";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AppWithSession() {
  const { session } = useSession();

  useSyncSession(session);

  return (
    <OfflineProgressProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        {/* <ConnectionStatusIndicator /> */}
        <StatusBar barStyle={"dark-content"} />
      </ThemeProvider>
    </OfflineProgressProvider>
  );
}
