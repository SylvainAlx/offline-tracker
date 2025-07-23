import { getAllMeasures } from "@/api/measures";
import { COLORS, SIZES } from "@/constants/Theme";
import { useSession } from "@/contexts/SessionContext";
import { globalStyles } from "@/styles/global.styles";
import { OfflinePeriod } from "@/types/OfflinePeriod";
import { Button } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

type DailySummary = {
  date: string;
  displayDate: string;
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

    const grouped = parsed.reduce<Record<string, number>>((acc, period) => {
      const dayKey = format(parseISO(period.from), "yyyy-MM-dd");
      acc[dayKey] = (acc[dayKey] || 0) + (period.duration || 0);
      return acc;
    }, {});

    const summaries: DailySummary[] = Object.entries(grouped)
      .sort(([a], [b]) => (a < b ? 1 : -1))
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
    <FlatList
      data={dailyData}
      keyExtractor={(item) => item.date}
      style={{ flex: 1, backgroundColor: COLORS.background }} // important ici
      contentContainerStyle={{
        padding: SIZES.padding,
        gap: SIZES.margin,
      }}
      showsVerticalScrollIndicator
      ListHeaderComponent={
        <>
          <Text style={globalStyles.title}>Mesures synchnonisées</Text>
          {dailyData.length === 0 && (
            <Text style={globalStyles.contentText}>
              Aucune session hors ligne enregistrée.
            </Text>
          )}
          <Button
            title="Actualiser"
            onPress={() => session && loadSlots(session)}
            color={COLORS.primary}
            radius={100}
            style={globalStyles.button}
          />
        </>
      }
      renderItem={({ item }) => (
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>📅 {item.displayDate}</Text>
          <Text style={globalStyles.contentText}>
            ⏱️ Total : {formatDuration(item.totalSeconds)}
          </Text>
        </View>
      )}
    />
  );
}
