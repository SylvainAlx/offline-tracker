import GoalProgress from "@/components/GoalProgress";
import { GOALS } from "@/constants/Goals";
import { useOfflineProgress } from "@/contexts/OfflineProgressContext";
import { useSession } from "@/contexts/SessionContext";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function GoalsScreen() {
  const { totalSyncSeconds } = useSession();
  const { totalUnsync } = useOfflineProgress();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Objectifs hors ligne</Text>
      <FlatList
        data={GOALS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GoalProgress
            goal={item}
            totalSeconds={totalSyncSeconds + totalUnsync}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
