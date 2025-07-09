import { config } from "@/config/env";
import { STORAGE_KEYS } from "@/constants/Labels";
import { getOrCreateDeviceId } from "@/utils/getOrCreateDeviceId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";
import {
  addPeriod,
  closeLastPeriod,
  getUnsyncedPeriods,
} from "../storage/offlineStorage";

export function useOfflineTracker() {
  const wasOffline = useRef(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      isInitialized.current = true;
    }, config.startupDelayMs);

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isConnected = state.isConnected && state.isInternetReachable;
      if (!isInitialized.current) return;

      if (!isConnected && !wasOffline.current) {
        wasOffline.current = true;
        await addPeriod({ from: new Date().toISOString() });
      }

      if (isConnected && wasOffline.current) {
        wasOffline.current = false;
        await closeLastPeriod(new Date().toISOString());
        const deviceId = await getOrCreateDeviceId();
        const deviceName =
          (await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_NAME)) || "Inconnu";
        const username =
          (await AsyncStorage.getItem(STORAGE_KEYS.USERNAME)) || "user";
        const periods = await getUnsyncedPeriods();

        console.log("Syncing offline periods", {
          deviceId,
          deviceName,
          username,
          offlinePeriods: periods,
        });

        // const success = await syncPeriodsToServer({
        //   deviceId,
        //   deviceName,
        //   username,
        //   offlinePeriods: periods,
        // });
        // if (success) await clearPeriods();
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);
}

export async function clearOfflinePeriods() {
  await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_PERIODS);
}
