import { config } from "@/config/env";
import { STORAGE_KEYS } from "@/constants/Labels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OfflinePeriod } from "../types/OfflinePeriod";

export async function getPeriods(): Promise<OfflinePeriod[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_PERIODS);
  return json ? JSON.parse(json) : [];
}

export async function addPeriod(period: OfflinePeriod) {
  const data = await getPeriods();
  data.push(period);
  await AsyncStorage.setItem(
    STORAGE_KEYS.OFFLINE_PERIODS,
    JSON.stringify(data)
  );
}

export async function closeLastPeriod(to: string) {
  const data = await getPeriods();
  const reversed = [...data].reverse();
  const last = reversed.find((p) => !p.to);

  if (!last || !last.from) return;

  const fromDate = new Date(last.from);
  const toDate = new Date(to);
  const duration = toDate.getTime() - fromDate.getTime();

  if (duration >= config.startupDelayMs) {
    last.to = to;
  } else {
    // Supprimer la période si elle est trop courte
    const index = reversed.indexOf(last);
    if (index !== -1) reversed.splice(index, 1);
  }

  // Sauvegarder les données dans le bon ordre
  await AsyncStorage.setItem(
    STORAGE_KEYS.OFFLINE_PERIODS,
    JSON.stringify(reversed.reverse())
  );
}

export async function getUnsyncedPeriods(): Promise<OfflinePeriod[]> {
  return await getPeriods();
}

export async function clearPeriods() {
  await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_PERIODS);
}
