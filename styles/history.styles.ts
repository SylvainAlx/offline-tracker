import { StyleSheet } from "react-native";

export const historyStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  empty: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
  text: {
    fontSize: 16,
  },
  item: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: "#333",
  },
});
