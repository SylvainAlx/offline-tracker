import { deleteAccount, logout } from "@/api/auth";
import { updateUser } from "@/api/users";
import { COLORS } from "@/constants/Theme";
import { useSession } from "@/contexts/SessionContext";
import { globalStyles } from "@/styles/global.styles";
import { confirmDialog, showMessage } from "@/utils/formatNotification";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const { setTotalSyncSeconds, username, setUsername, deviceName } =
    useSession();

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
      <View style={globalStyles.card}>
        <Text style={globalStyles.title}>{deviceName}</Text>
        <View style={[styles.verticallySpaced]}>
          <Input
            style={globalStyles.input}
            label="E-mail"
            labelStyle={{ color: COLORS.text }}
            value={session?.user?.email}
            disabled
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            style={globalStyles.input}
            label="Nom d'utilisateur"
            labelStyle={{ color: COLORS.text }}
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
