import { SessionProvider } from "@/contexts/SessionContext";
import { useFonts } from "expo-font";
import AppWithSession from "./AppWithSession";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <SessionProvider>
      <AppWithSession />
    </SessionProvider>
  );
}
