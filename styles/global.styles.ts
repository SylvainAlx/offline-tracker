import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // espace en bas pour scroll agréable
    flexGrow: 1, // important pour ScrollView
    backgroundColor: "#f5f7fa",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
