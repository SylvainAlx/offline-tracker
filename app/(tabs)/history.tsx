import { STORAGE_KEYS } from "@/constants/Labels";
import { OfflinePeriod } from "@/types/OfflinePeriod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
  const [slots, setSlots] = useState<OfflinePeriod[]>([]);

  const loadSlots = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_PERIODS);
    if (!raw) return;
    setSlots(JSON.parse(raw));
  };

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique hors ligne</Text>
      </View>

      {slots.length === 0 ? (
        <Text style={styles.empty}>Aucune session hors ligne enregistrée.</Text>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            const start = format(
              new Date(item.from),
              "EEEE dd MMMM yyyy HH:mm:ss",
              { locale: fr }
            );
            const end =
              item.to &&
              format(new Date(item.to), "'→' HH:mm:ss", { locale: fr });
            return (
              <View style={styles.item}>
                <Text style={styles.text}>
                  {start} {end}
                </Text>
              </View>
            );
          }}
        />
      )}
      <Button title="Actualiser" onPress={loadSlots} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  empty: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 16,
  },
});
