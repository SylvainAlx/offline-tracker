import { deleteAccount, logout } from "@/api/auth";
import { getUser, updateUser } from "@/api/users";
import { COLORS } from "@/constants/Theme";
import { useSession } from "@/contexts/SessionContext";
import { useSyncSession } from "@/hooks/useSyncSession";
import { globalStyles } from "@/styles/global.styles";
import { confirmDialog, showMessage } from "@/utils/formatNotification";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const { getAndUpdateLocalDevice } = useSyncSession(session);
  const {
    setTotalSyncSeconds,
    username,
    setUsername,
    deviceName,
    setDeviceName,
  } = useSession();

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
        showMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username }: { username: string }) {
    const confirmed = await confirmDialog("Mettre à jour le profil ?");
    if (!confirmed) return;
    try {
      setLoading(true);
      await updateUser({ session, username });
      showMessage("Profil mis à jour avec succès.");
    } catch (error) {
      if (error instanceof Error) {
        showMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{deviceName}</Text>
      <View style={[styles.verticallySpaced]}>
        <Input
          style={globalStyles.contentText}
          label="E-mail"
          value={session?.user?.email}
          disabled
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          style={globalStyles.contentText}
          label="Nom d'utilisateur"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      <View style={[globalStyles.buttonContainer]}>
        <Button
          title={loading ? "Chargement ..." : "Mettre à jour"}
          onPress={() => updateProfile({ username: username ?? "" })}
          disabled={loading}
          color={COLORS.primary}
          radius={100}
          style={globalStyles.button}
        />
        <Button
          title="Se déconnecter"
          color={COLORS.warning}
          onPress={() => {
            logout();
            setTotalSyncSeconds(0);
          }}
          radius={100}
          style={globalStyles.button}
        />
        <Button
          title="Supprimer le compte"
          color={COLORS.danger}
          onPress={() => {
            deleteAccount();
            setTotalSyncSeconds(0);
          }}
          radius={100}
          style={globalStyles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});
