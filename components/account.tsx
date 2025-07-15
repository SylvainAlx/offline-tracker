import { getUser, updateUser } from "@/api/users";
import { useSession } from "@/contexts/SessionContext";
import { useSyncSession } from "@/hooks/useSyncSession";
import { supabase } from "@/utils/supabase";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const { getAndUpdateLocalDevice } = useSyncSession(session);
  const { setTotalSyncSeconds } = useSession();

  useEffect(() => {
    if (session) getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const data = await getUser(session);
      if (data) {
        setUsername(data.username);
      }
      const device = await getAndUpdateLocalDevice(session);
      setDeviceName(device);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username }: { username: string }) {
    try {
      setLoading(true);
      await updateUser({ session, username });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.device}>{deviceName}</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="E-mail" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Nom d'utilisateur"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Chargement ..." : "Mettre à jour"}
          onPress={() => updateProfile({ username })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Se déconnecter"
          onPress={() => {
            supabase.auth.signOut();
            setTotalSyncSeconds(0);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  device: {
    fontSize: 24,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
});
