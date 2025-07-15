// app/(tabs)/account.tsx
import Auth from "@/components/Auth";
import Account from "@/components/account";
import { useSession } from "@/contexts/SessionContext";
import { View } from "react-native";

export default function ProfileScreen() {
  const { session } = useSession();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {session && session.user ? <Account session={session} /> : <Auth />}
    </View>
  );
}
