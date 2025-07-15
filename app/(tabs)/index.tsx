import GoalProgress from "@/components/GoalProgress";
import { GOALS } from "@/constants/Goals";
import { useOfflineProgress } from "@/contexts/OfflineProgressContext";
import { useSession } from "@/contexts/SessionContext";
import { useSyncSession } from "@/hooks/useSyncSession";
import { formatDuration } from "@/utils/formatDuration";
import { getLastOpenPeriod } from "@/utils/getOfflineTime";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const [since, setSince] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<string>("0s");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { totalSyncSeconds, session } = useSession();
  const { syncMeasures } = useSyncSession(session);
  const { totalUnsync, isOnline } = useOfflineProgress();
  const [nextGoal, setNextGoal] = useState<(typeof GOALS)[0] | undefined>(
    undefined
  );

  useEffect(() => {
    const loadStartTime = async () => {
      const now = new Date();
      const startTime = await getLastOpenPeriod(); // Assume this function fetches the start time from storage
      if (startTime) {
        setSince(new Date(startTime));
        const diff = Math.floor(
          (now.getTime() - new Date(startTime).getTime()) / 1000
        );
        setElapsed(formatDuration(diff));
      }
    };
    if (!isOnline) loadStartTime();
  }, [isOnline]);

  useEffect(() => {
    const goal = GOALS.find(
      (goal) => totalSyncSeconds + totalUnsync < goal.targetSeconds
    );
    setNextGoal(goal);
  }, [totalSyncSeconds, totalUnsync]);

  useEffect(() => {
    if (since && !isOnline) {
      intervalRef.current = setInterval(async () => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - since.getTime()) / 1000);
        setElapsed(formatDuration(diff));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOnline, since]);

  return (
    <View
      style={[styles.container, isOnline ? styles.onlineBg : styles.offlineBg]}
    >
      <View style={styles.card}>
        <Text
          style={[
            styles.statusText,
            isOnline ? styles.onlineText : styles.offlineText,
          ]}
        >
          {isOnline === null
            ? "Chargement..."
            : isOnline
            ? "📶 Appareil connecté à internet"
            : "🧘 Appareil hors ligne"}
        </Text>

        {!isOnline && since && (
          <Text style={styles.timer}>⏳ Depuis {elapsed}</Text>
        )}

        <Text style={styles.message}>
          {isOnline
            ? "🌐 Coupe ta connexion pour commencer une session focus."
            : "✨ Bien joué ! Profite de ta déconnexion pour te recentrer."}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Statistiques</Text>

        <Text style={styles.totalLabel}>🔄 Synchronisé :</Text>
        <Text style={styles.totalValue}>
          {formatDuration(totalSyncSeconds)}
        </Text>

        <Text style={styles.totalLabel}>📥 Non synchronisé :</Text>
        <Text style={styles.totalValue}>{formatDuration(totalUnsync)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🎯 Objectif en cours</Text>
        {nextGoal && (
          <GoalProgress
            goal={nextGoal}
            totalSeconds={totalSyncSeconds + totalUnsync}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🔄 Synchronisation</Text>
        <Text style={styles.message}>
          {session
            ? "Compte et appareil liés"
            : "Vous devez avoir un compte pour synchroniser le temps hors ligne"}
        </Text>
        {session ? (
          <Button
            title="Synchroniser"
            color={isOnline ? "#007aff" : "#aaa"}
            disabled={!isOnline || totalUnsync === 0}
            onPress={() => session && syncMeasures(session)}
          />
        ) : (
          <Link href={"/profile"}>
            <Button title="Accéder au profile" color={"#007aff"} />
          </Link>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  timer: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  onlineText: {
    color: "#007aff",
  },
  offlineText: {
    color: "#4CAF50",
  },
  onlineBg: {
    backgroundColor: "#eaf4ff",
  },
  offlineBg: {
    backgroundColor: "#e6f4ea",
  },
});
