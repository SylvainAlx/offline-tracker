import GoalProgress from "@/components/GoalProgress";
import { GOALS } from "@/constants/Goals";
import { useOfflineProgress } from "@/contexts/OfflineProgressContext";
import { useSession } from "@/contexts/SessionContext";
import { globalStyles } from "@/styles/global.styles";
import { FlatList, Text, View } from "react-native";

export default function GoalsScreen() {
  const { totalSyncSeconds } = useSession();
  const { totalUnsync } = useOfflineProgress();

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>🏆 Objectifs hors ligne</Text>
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
