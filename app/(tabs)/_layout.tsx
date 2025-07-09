import { AppHeaderTitle } from "@/components/AppHeaderTitle";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTheme } from "@react-navigation/native";
import { router, Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerTitle: () => <AppHeaderTitle />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
        headerStyle: {
          backgroundColor: "#000", // couleur de fond du header
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerTintColor: "#333", // couleur du texte / icônes
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/profile")}
            style={{ marginRight: 16 }}
          >
            <IconSymbol
              name="person.crop.circle"
              size={24}
              color={colors.text}
            />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "Objectifs",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="trophy.fill" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historique",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="clock" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.crop.circle" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
