import { getAllMeasures } from "@/api/measures";
import { useSession } from "@/contexts/SessionContext";
import { globalStyles } from "@/styles/global.styles";
import { historyStyles } from "@/styles/history.styles";
import { OfflinePeriod } from "@/types/OfflinePeriod";
import { Session } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";

type DailySummary = {
  date: string; // yyyy-MM-dd
  displayDate: string; // Lundi 15 juillet 2025
  totalSeconds: number;
};

export default function HistoryScreen() {
  const [dailyData, setDailyData] = useState<DailySummary[]>([]);
  const { session } = useSession();

  const loadSlots = async (session: Session) => {
    const raw = await getAllMeasures(session);
    if (!raw) return;

    const parsed: OfflinePeriod[] = raw.map((item: any) => ({
      from: item.start,
      to: item.end,
      duration: item.duration,
    }));

    // Grouper par jour
    const grouped = parsed.reduce<Record<string, number>>((acc, period) => {
      const dayKey = format(parseISO(period.from), "yyyy-MM-dd");
      acc[dayKey] = (acc[dayKey] || 0) + (period.duration || 0);
      return acc;
    }, {});

    const summaries: DailySummary[] = Object.entries(grouped)
      .sort(([a], [b]) => (a < b ? 1 : -1)) // plus récents en haut
      .map(([date, totalSeconds]) => ({
        date,
        displayDate: format(parseISO(date), "EEEE d MMMM yyyy", {
          locale: fr,
        }),
        totalSeconds,
      }));

    setDailyData(summaries);
  };

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    if (session) loadSlots(session);
  }, [session]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Historique hors ligne</Text>

      {dailyData.length === 0 ? (
        <Text style={historyStyles.empty}>
          Aucune session hors ligne enregistrée.
        </Text>
      ) : (
        <FlatList
          data={dailyData}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={historyStyles.item}>
              <Text style={historyStyles.date}>📅 {item.displayDate}</Text>
              <Text style={historyStyles.duration}>
                ⏱️ Total : {formatDuration(item.totalSeconds)}
              </Text>
            </View>
          )}
        />
      )}

      <Button
        title="Actualiser"
        onPress={() => session && loadSlots(session)}
      />
    </View>
  );
}
