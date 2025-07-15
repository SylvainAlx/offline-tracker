import { getDeviceId, insertDevice } from "@/api/devices";
import { getTotalDuration, insertMeasure } from "@/api/measures";
import { useOfflineProgress } from "@/contexts/OfflineProgressContext";
import { useSession } from "@/contexts/SessionContext";
import { clearPeriod, getUnsyncedPeriods } from "@/storage/offlineStorage";
import { Session } from "@supabase/supabase-js";
import * as Device from "expo-device";
import { useEffect } from "react";

export const useSyncSession = (session: Session | null) => {
  const { setTotalSyncSeconds, totalSyncSeconds } = useSession();
  const { setTotalUnsync } = useOfflineProgress();

  const syncMeasures = async (session: Session): Promise<boolean> => {
    let globalSuccess = true;
    let totalTime = 0;
    const periods = await getUnsyncedPeriods();
    const modelName = Device.modelName ?? "Unknown Device";
    for (let i = periods.length - 1; i >= 0; i--) {
      const start = new Date(periods[i].from);
      const end = new Date(periods[i].to ?? periods[i].from);
      const duration = Math.floor((end.getTime() - start.getTime()) / 1000); // duration in seconds
      const { success } = await insertMeasure(
        session,
        modelName,
        start,
        end,
        duration
      );
      if (success) {
        await clearPeriod(i);
        totalTime += duration;
      } else {
        globalSuccess = false;
      }
    }
    if (globalSuccess) {
      setTotalUnsync(0);
      setTotalSyncSeconds(totalSyncSeconds + totalTime);
    }
    return globalSuccess;
  };

  const getAndUpdateLocalDevice = async (session: Session): Promise<string> => {
    const deviceName = Device.modelName;
    if (deviceName) {
      try {
        const data = await getDeviceId(session, deviceName);
        if (!data) {
          console.warn("Device not found in database, inserting new device.");
          await insertDevice(session, deviceName);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn("No device ID found, skipping device check.");
    }
    return deviceName ?? "Unknown Device";
  };

  useEffect(() => {
    const loadTotalSyncTime = async (session: Session) => {
      const totalSeconds = await getTotalDuration(session);
      setTotalSyncSeconds(totalSeconds);
    };

    if (session) {
      loadTotalSyncTime(session);
      getAndUpdateLocalDevice(session);
    }

    return () => {
      // Cleanup if necessary
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return { session, syncMeasures, getAndUpdateLocalDevice };
};
