import { Alert, Platform } from "react-native";

export function showMessage(text: string) {
  if (Platform.OS === "web") {
    alert(text);
  } else {
    Alert.alert("Info", text);
  }
}
