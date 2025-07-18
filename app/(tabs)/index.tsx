import GoalProgress from "@/components/GoalProgress";
import { GOALS } from "@/constants/Goals";
import { useOfflineProgress } from "@/contexts/OfflineProgressContext";
import { useSession } from "@/contexts/SessionContext";
import { useSyncSession } from "@/hooks/useSyncSession";
import { globalStyles } from "@/styles/global.styles";
import { indexStyles } from "@/styles/index.styles";
import { formatDuration } from "@/utils/formatDuration";
import { getLastOpenPeriod } from "@/utils/getOfflineTime";
import { Session } from "@supabase/supabase-js";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";

export default function Home() {
  const [since, setSince] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<string>("0s");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { totalSyncSeconds, session, username } = useSession();
  const { syncMeasures } = useSyncSession(session);
  const { totalUnsync, isOnline } = useOfflineProgress();
  const [nextGoal, setNextGoal] = useState<(typeof GOALS)[0] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const sendPeriods = async (session: Session) => {
    try {
      setIsLoading(true);
      await syncMeasures(session);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <ScrollView
      style={isOnline ? indexStyles.onlineBg : indexStyles.offlineBg}
      contentContainerStyle={globalStyles.container}
      showsVerticalScrollIndicator={true}
    >
      <Text style={globalStyles.title}>Bienvenue {username && username} !</Text>
      <View style={globalStyles.card}>
        <Text
          style={[
            indexStyles.statusText,
            isOnline ? indexStyles.onlineText : indexStyles.offlineText,
          ]}
        >
          {isOnline === null
            ? "Chargement..."
            : isOnline
            ? "📶 Appareil connecté à internet"
            : "🧘 Appareil hors ligne"}
        </Text>

        {!isOnline && since && (
          <Text style={indexStyles.timer}>⏳ Depuis {elapsed}</Text>
        )}

        <Text style={indexStyles.message}>
          {isOnline
            ? "🌐 Coupe ta connexion pour commencer une session focus."
            : "✨ Bien joué ! Profite de ta déconnexion pour te recentrer."}
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={indexStyles.sectionTitle}>Statistiques</Text>
        <View>
          <Text style={indexStyles.totalLabel}>🔄 Synchronisé :</Text>
          <Text style={indexStyles.totalValue}>
            {formatDuration(totalSyncSeconds)}
          </Text>
        </View>
        <View>
          <Text style={indexStyles.totalLabel}>📥 Non synchronisé :</Text>
          {!isOnline && totalUnsync === 0 ? (
            <Text style={indexStyles.totalValue}>DÉMARRAGE...</Text>
          ) : (
            <Text style={indexStyles.totalValue}>
              {formatDuration(totalUnsync)}
            </Text>
          )}
        </View>
      </View>

      <View style={globalStyles.card}>
        <Text style={indexStyles.sectionTitle}>🎯 Objectif en cours</Text>
        {nextGoal && (
          <GoalProgress
            goal={nextGoal}
            totalSeconds={totalSyncSeconds + totalUnsync}
          />
        )}
      </View>

      <View style={globalStyles.card}>
        <Text style={indexStyles.sectionTitle}>🔄 Synchronisation</Text>
        <Text style={indexStyles.message}>
          {session
            ? "Compte et appareil liés"
            : "Vous devez avoir un compte pour synchroniser le temps hors ligne"}
        </Text>
        {session ? (
          <Button
            title="Synchroniser"
            color={isOnline ? "#007aff" : "#aaa"}
            disabled={!isOnline || totalUnsync === 0 || isLoading}
            onPress={() => session && sendPeriods(session)}
          />
        ) : (
          <Link href={"/profile"}>
            <Button title="Accéder au profile" color={"#007aff"} />
          </Link>
        )}
      </View>
    </ScrollView>
  );
}
