import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export async function getDeviceId(session: Session, deviceName: string) {
  try {
    if (!session?.user) throw new Error("No user on the session!");

    const { data, error, status } = await supabase
      .from("devices")
      .select(`id`)
      .eq("user_id", session?.user.id)
      .eq("name", deviceName)
      .single();
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

export async function insertDevice(session: Session, deviceName: string) {
  try {
    if (!session?.user) throw new Error("No user on the session!");

    const { data: existingDevices, error: selectError } = await supabase
      .from("devices")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("name", deviceName)
      .limit(1);

    if (selectError) throw selectError;
    if (existingDevices && existingDevices.length > 0) {
      throw new Error("A device with this name already exists for this user.");
    }

    const { error } = await supabase.from("devices").insert([
      {
        user_id: session.user.id,
        name: deviceName,
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
