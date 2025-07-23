import { COLORS, SIZES } from "@/constants/Theme";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    flexGrow: 1, // important pour ScrollView
    backgroundColor: COLORS.background,
    display: "flex",
    flexDirection: "column",
    gap: SIZES.margin,
  },
  title: {
    color: COLORS.primary,
    fontSize: SIZES.text_xl,
    fontWeight: "bold",
    marginBottom: SIZES.margin,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: SIZES.borderWidth,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: SIZES.text_lg,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: SIZES.margin,
    textAlign: "center",
  },
  contentText: {
    fontSize: SIZES.text_lg,
    color: COLORS.text,
  },
  link: {
    marginTop: SIZES.margin,
    paddingVertical: SIZES.padding / 2,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  buttonContainer: {
    marginTop: SIZES.margin,
    marginBottom: SIZES.margin,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SIZES.margin,
  },
  button: {
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    alignItems: "center",
  },
});
