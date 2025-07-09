import { SyncPayload } from "@/types/SyncPayload";
import { getOrCreateDeviceId } from "@/utils/getOrCreateDeviceId";

const API_URL = "https://yourapi.com/api/sync"; // à remplacer

export async function syncPeriodsToServer(
  payload: SyncPayload
): Promise<boolean> {
  try {
    payload.deviceId = await getOrCreateDeviceId();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN", // facultatif
      },
      body: JSON.stringify({ payload }),
    });

    return res.ok;
  } catch (e) {
    console.warn("Sync failed", e);
    return false;
  }
}
