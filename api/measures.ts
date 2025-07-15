import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { getDeviceId } from "./devices";

export async function getAllMeasures(session: Session) {
  try {
    if (!session?.user) throw new Error("No user on the session!");

    const { data, error, status } = await supabase
      .from("measures")
      .select(`start, end, duration`)
      .eq("user_id", session?.user.id);
    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}

export async function getTotalDuration(session: Session) {
  try {
    if (!session?.user) throw new Error("No user on the session!");

    const { data, error, status } = await supabase
      .from("measures")
      .select("duration", { count: "exact", head: false })
      .eq("user_id", session.user.id);

    if (error && status !== 406) {
      throw error;
    }

    const total =
      data?.reduce((sum, item) => sum + (item.duration || 0), 0) ?? 0;
    return total;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return 0;
  }
}

export async function insertMeasure(
  session: Session,
  deviceName: string,
  start: Date,
  end: Date,
  duration: number
) {
  try {
    if (!session?.user) throw new Error("No user on the session!");
    if (duration <= 0) {
      throw new Error("Duration must be greater than 0");
    }
    const deviceId = await getDeviceId(session, deviceName);
    const { error } = await supabase.from("measures").insert([
      {
        user_id: session.user.id,
        device_id: deviceId?.id,
        start: start.toISOString(),
        end: end.toISOString(),
        duration,
      },
    ]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return { success: false };
  }
}
