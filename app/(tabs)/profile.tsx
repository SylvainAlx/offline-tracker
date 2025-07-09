import { STORAGE_KEYS } from "@/constants/Labels";
import { clearOfflinePeriods } from "@/hooks/useOfflineTracker";
import { getOrCreateDeviceId } from "@/utils/getOrCreateDeviceId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const handleReset = () => {
    if (Platform.OS === "web") {
      const confirm = window.confirm(
        "Es-tu sûr de vouloir réinitialiser le temps hors ligne ? Cette action est irréversible."
      );
      if (confirm) {
        clearOfflinePeriods().then(() => {
          window.alert(
            "Historique effacé, toutes les périodes hors ligne ont été supprimées."
          );
        });
      }
    } else {
      Alert.alert(
        "Confirmer la réinitialisation",
        "Es-tu sûr de vouloir supprimer toutes les périodes hors ligne ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              await clearOfflinePeriods();
              Alert.alert(
                "Historique effacé",
                "Toutes les périodes hors ligne ont été supprimées."
              );
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  // Charger nom utilisateur depuis AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      const storedName = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
      if (storedName) setUsername(storedName);

      let deviceName = "Inconnu";
      if (Device.modelName) {
        deviceName = `${Device.manufacturer ?? ""} ${Device.modelName}`;
      } else {
        deviceName =
          Platform.OS === "web" ? "Navigateur Web" : "Appareil inconnu";
      }

      setDeviceName(deviceName);

      const id = await getOrCreateDeviceId();
      setDeviceId(id);
    };

    loadData();
  }, []);

  // Sauvegarder automatiquement à chaque changement
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  }, [username]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.DEVICE_NAME, deviceName);
  }, [deviceName]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <Text style={styles.label}>Nom de l&apos;appareil :</Text>
      <Text style={styles.value}>{deviceName || "Inconnu"}</Text>
      <Text style={styles.label}>ID unique (référence utilisateur) :</Text>
      <Text style={styles.value}>{deviceId}</Text>

      <Text style={styles.label}>Nom d&apos;utilisateur :</Text>
      <TextInput
        style={styles.input}
        placeholder="Ton prénom ou pseudo"
        value={username}
        onChangeText={setUsername}
      />
      <Button
        title="Réinitialiser le temps hors ligne"
        onPress={handleReset}
        color="#d9534f"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  confirmation: {
    marginTop: 12,
    color: "#4CAF50",
  },
});
