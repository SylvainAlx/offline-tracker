import GoalProgress from "@/components/GoalProgress";
import { GOALS } from "@/constants/Goals";
import { useOfflineProgress } from "@/contexts/OfflineProgressContext";
import { formatDuration } from "@/utils/formatDuration";
import { getLastOpenPeriod } from "@/utils/getOfflineTime";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [since, setSince] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<string>("0s");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { totalSeconds } = useOfflineProgress();

  const nextGoal = GOALS.find((goal) => totalSeconds < goal.targetSeconds);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected ?? false);

      if (!connected) {
        const open = await getLastOpenPeriod();
        setSince(open);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (since && !isConnected) {
      intervalRef.current = setInterval(async () => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - since.getTime()) / 1000);
        setElapsed(formatDuration(diff));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isConnected, since]);

  return (
    <View
      style={[
        styles.container,
        !isConnected ? styles.offlineBg : styles.onlineBg,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          !isConnected ? styles.offlineText : styles.onlineText,
        ]}
      >
        {isConnected === null
          ? "Chargement..."
          : !isConnected
          ? "🧘 Tu es hors ligne"
          : "📶 En ligne"}
      </Text>
      {!isConnected && (
        <Text style={styles.timer}>{since ? `Depuis ${elapsed}` : ""}</Text>
      )}
      {isConnected ? (
        <Text style={styles.info}>
          Tu es connecté ! Coupe ta connexion internet pour commencer 🌐
        </Text>
      ) : (
        <Text style={styles.encouragement}>
          👏 Bien joué ! Profite de ta déconnexion pour te recentrer ✨
        </Text>
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>⏱️ Temps total hors ligne :</Text>
        <Text style={styles.totalValue}>{formatDuration(totalSeconds)}</Text>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.label}>Objectif en cours :</Text>
          {nextGoal && (
            <GoalProgress goal={nextGoal} totalSeconds={totalSeconds} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statusText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timer: {
    fontSize: 18,
    color: "#888",
  },
  info: {
    marginTop: 20,
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  encouragement: {
    marginTop: 20,
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
  },
  totalContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  onlineText: { color: "#007aff" },
  offlineText: { color: "#4CAF50" },
  onlineBg: { backgroundColor: "#f0f8ff" },
  offlineBg: { backgroundColor: "#e8f5e9" },
});
