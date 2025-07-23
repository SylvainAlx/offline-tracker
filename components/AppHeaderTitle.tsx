import { COLORS } from "@/constants/Theme";
import { StyleSheet, Text } from "react-native";

export function AppHeaderTitle() {
  return <Text style={styles.headerTitle}>dinet</Text>;
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 30,
    color: COLORS.accent,
  },
});
