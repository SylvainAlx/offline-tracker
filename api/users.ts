import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

export async function getUser(session: Session) {
  try {
    if (!session?.user) throw new Error("No user on the session!");

    const { data, error, status } = await supabase
      .from("users")
      .select(`username`)
      .eq("id", session?.user.id)
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

export async function updateUser({
  session,
  username,
}: {
  session: Session;
  username: string;
}) {
  try {
    if (!session?.user) throw new Error("No user on the session!");

    const updates = {
      id: session?.user.id,
      username,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("users").upsert(updates);

    if (error) {
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}
